$f='src\components\ui\Avatar.tsx'
$bytes=[System.IO.File]::ReadAllBytes((Resolve-Path $f))
Write-Host ('Length: ' + $bytes.Length)
$first=($bytes[0..20] | ForEach-Object { $_.ToString('X2') }) -join ' '
Write-Host ('First 20 bytes: ' + $first)
$hasBOM = ($bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF)
Write-Host ('Has UTF-8 BOM: ' + $hasBOM)
$text=[System.Text.Encoding]::UTF8.GetString($bytes)
$lines=$text -split "`r?`n"
Write-Host ('Line count: ' + $lines.Count)
for($i=114; $i -lt 122; $i++){ 
  Write-Host (($i+1).ToString() + ': [' + $lines[$i] + ']') 
}