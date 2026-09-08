param(
  [Parameter(Mandatory = $true)]
  [string]$BrandBoard,

  [Parameter(Mandatory = $true)]
  [string]$SocialBackground
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent $PSScriptRoot
$brandDirectory = Join-Path $projectRoot 'assets\brand'
$faviconDirectory = Join-Path $projectRoot 'assets\favicon'
$null = New-Item -ItemType Directory -Force -Path $brandDirectory, $faviconDirectory

function New-Bitmap([int]$width, [int]$height) {
  return [System.Drawing.Bitmap]::new(
    $width,
    $height,
    [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
  )
}

function New-Graphics([System.Drawing.Image]$image) {
  $graphics = [System.Drawing.Graphics]::FromImage($image)
  $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceOver
  $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  return $graphics
}

function Copy-Region(
  [System.Drawing.Bitmap]$source,
  [System.Drawing.Rectangle]$sourceRectangle
) {
  $result = New-Bitmap $sourceRectangle.Width $sourceRectangle.Height
  $graphics = New-Graphics $result
  $graphics.DrawImage(
    $source,
    [System.Drawing.Rectangle]::new(0, 0, $result.Width, $result.Height),
    $sourceRectangle,
    [System.Drawing.GraphicsUnit]::Pixel
  )
  $graphics.Dispose()
  return $result
}

function Save-ResizedPng(
  [System.Drawing.Image]$source,
  [int]$size,
  [string]$path
) {
  $result = New-Bitmap $size $size
  $graphics = New-Graphics $result
  $graphics.Clear([System.Drawing.Color]::Transparent)
  $graphics.DrawImage($source, 0, 0, $size, $size)
  $graphics.Dispose()
  $result.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $result.Dispose()
}

function New-RoundedPath([System.Drawing.RectangleF]$rectangle, [float]$radius) {
  $diameter = $radius * 2
  $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $path.AddArc($rectangle.X, $rectangle.Y, $diameter, $diameter, 180, 90)
  $path.AddArc($rectangle.Right - $diameter, $rectangle.Y, $diameter, $diameter, 270, 90)
  $path.AddArc($rectangle.Right - $diameter, $rectangle.Bottom - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($rectangle.X, $rectangle.Bottom - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  return $path
}

function Save-PngIco(
  [string[]]$pngPaths,
  [string]$path
) {
  $images = @($pngPaths | ForEach-Object { ,([System.IO.File]::ReadAllBytes($_)) })
  $stream = [System.IO.File]::Create($path)
  $writer = [System.IO.BinaryWriter]::new($stream)
  try {
    $writer.Write([uint16]0)
    $writer.Write([uint16]1)
    $writer.Write([uint16]$images.Count)

    $offset = 6 + (16 * $images.Count)
    for ($index = 0; $index -lt $images.Count; $index++) {
      $bitmap = [System.Drawing.Image]::FromFile($pngPaths[$index])
      try {
        $widthByte = if ($bitmap.Width -ge 256) { 0 } else { $bitmap.Width }
        $heightByte = if ($bitmap.Height -ge 256) { 0 } else { $bitmap.Height }
        $writer.Write([byte]$widthByte)
        $writer.Write([byte]$heightByte)
      } finally {
        $bitmap.Dispose()
      }
      $writer.Write([byte]0)
      $writer.Write([byte]0)
      $writer.Write([uint16]1)
      $writer.Write([uint16]32)
      $writer.Write([uint32]$images[$index].Length)
      $writer.Write([uint32]$offset)
      $offset += $images[$index].Length
    }

    foreach ($imageBytes in $images) {
      $writer.Write($imageBytes)
    }
  } finally {
    $writer.Dispose()
    $stream.Dispose()
  }
}

$board = [System.Drawing.Bitmap]::FromFile((Resolve-Path -LiteralPath $BrandBoard))
try {
  # Official dark lock-up, copied pixel-for-pixel from the supplied brand board.
  $verticalLogo = Copy-Region $board ([System.Drawing.Rectangle]::new(465, 21, 401, 378))
  try {
    $verticalLogo.Save(
      (Join-Path $brandDirectory 'harzam-logo.png'),
      [System.Drawing.Imaging.ImageFormat]::Png
    )
  } finally {
    $verticalLogo.Dispose()
  }

  # A footer lock-up assembled only from the official mark and wording in that same panel.
  $horizontalLogo = New-Bitmap 800 220
  $graphics = New-Graphics $horizontalLogo
  try {
    $graphics.Clear([System.Drawing.Color]::FromArgb(255, 13, 29, 44))
    $markSource = [System.Drawing.Rectangle]::new(555, 81, 230, 180)
    $copySource = [System.Drawing.Rectangle]::new(503, 269, 326, 104)
    $graphics.DrawImage($board, [System.Drawing.Rectangle]::new(34, 20, 230, 180), $markSource, [System.Drawing.GraphicsUnit]::Pixel)
    $graphics.DrawImage($board, [System.Drawing.Rectangle]::new(286, 55, 478, 152), $copySource, [System.Drawing.GraphicsUnit]::Pixel)
  } finally {
    $graphics.Dispose()
  }
  try {
    $horizontalLogo.Save(
      (Join-Path $brandDirectory 'harzam-logo-horizontal.png'),
      [System.Drawing.Imaging.ImageFormat]::Png
    )
  } finally {
    $horizontalLogo.Dispose()
  }

  # Isolate the official white-and-gold HZ from the navy panel, retaining antialiasing.
  $mark = Copy-Region $board ([System.Drawing.Rectangle]::new(555, 81, 230, 180))
  try {
    for ($y = 0; $y -lt $mark.Height; $y++) {
      for ($x = 0; $x -lt $mark.Width; $x++) {
        $pixel = $mark.GetPixel($x, $y)
        $brightness = [Math]::Max($pixel.R, [Math]::Max($pixel.G, $pixel.B))
        $alpha = [Math]::Max(0, [Math]::Min(255, [int](($brightness - 54) * 3.7)))
        $mark.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $pixel.R, $pixel.G, $pixel.B))
      }
    }

    $masterIcon = New-Bitmap 512 512
    $graphics = New-Graphics $masterIcon
    try {
      $graphics.Clear([System.Drawing.Color]::Transparent)
      $roundedRectangle = [System.Drawing.RectangleF]::new(8, 8, 496, 496)
      $roundedPath = New-RoundedPath $roundedRectangle 88
      $backgroundBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#0F1B2D'))
      try {
        $graphics.FillPath($backgroundBrush, $roundedPath)
      } finally {
        $backgroundBrush.Dispose()
        $roundedPath.Dispose()
      }
      $graphics.DrawImage($mark, [System.Drawing.Rectangle]::new(59, 99, 394, 308))
    } finally {
      $graphics.Dispose()
    }

    try {
      $masterIcon.Save(
        (Join-Path $brandDirectory 'harzam-monogram.png'),
        [System.Drawing.Imaging.ImageFormat]::Png
      )
      Save-ResizedPng $masterIcon 16 (Join-Path $faviconDirectory 'favicon-16x16.png')
      Save-ResizedPng $masterIcon 32 (Join-Path $faviconDirectory 'favicon-32x32.png')
      Save-ResizedPng $masterIcon 180 (Join-Path $faviconDirectory 'apple-touch-icon.png')
      Save-ResizedPng $masterIcon 192 (Join-Path $faviconDirectory 'android-chrome-192x192.png')
      Save-ResizedPng $masterIcon 512 (Join-Path $faviconDirectory 'android-chrome-512x512.png')
      Save-PngIco @(
        (Join-Path $faviconDirectory 'favicon-16x16.png'),
        (Join-Path $faviconDirectory 'favicon-32x32.png')
      ) (Join-Path $faviconDirectory 'favicon.ico')
    } finally {
      $masterIcon.Dispose()
    }
  } finally {
    $mark.Dispose()
  }

  # Finish the generated social background with an untouched official logo panel.
  $socialPlate = [System.Drawing.Bitmap]::FromFile((Resolve-Path -LiteralPath $SocialBackground))
  try {
    $socialCard = New-Bitmap 1200 630
    $graphics = New-Graphics $socialCard
    try {
      $graphics.DrawImage($socialPlate, [System.Drawing.Rectangle]::new(0, 0, 1200, 630))
      $officialLogo = [System.Drawing.Rectangle]::new(465, 21, 401, 378)
      $graphics.DrawImage($board, [System.Drawing.Rectangle]::new(103, 118, 300, 283), $officialLogo, [System.Drawing.GraphicsUnit]::Pixel)

      $whiteBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(242, 248, 246, 241))
      $goldBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#D2AE66'))
      $titleFont = [System.Drawing.Font]::new('Georgia', 34, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
      try {
        $graphics.DrawString('More Than A Resume.', $titleFont, $whiteBrush, 625, 245)
        $graphics.DrawString('A Brighter Tomorrow.', $titleFont, $whiteBrush, 625, 292)
        $graphics.FillRectangle($goldBrush, 627, 361, 98, 5)
      } finally {
        $titleFont.Dispose()
        $whiteBrush.Dispose()
        $goldBrush.Dispose()
      }
    } finally {
      $graphics.Dispose()
    }
    try {
      $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
      $parameters = [System.Drawing.Imaging.EncoderParameters]::new(1)
      $parameters.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new(
        [System.Drawing.Imaging.Encoder]::Quality,
        [long]92
      )
      try {
        $socialCard.Save((Join-Path $brandDirectory 'harzam-og-cover.jpg'), $jpegCodec, $parameters)
      } finally {
        $parameters.Dispose()
      }
    } finally {
      $socialCard.Dispose()
    }
  } finally {
    $socialPlate.Dispose()
  }
} finally {
  $board.Dispose()
}
