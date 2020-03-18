把一些被污染的域名，写入 `config.json`，然后执行，会自动从 `ipaddress.com` 查询到正确的 IP 地址，然后生成可以写入 `hosts` 的几行代码。

`config.json` 格式:
```json
{
  "hosts": [                           // 要查询的host
    "github.com",
    "assets-cdn.github.com",
    "github.global.ssl.fastly.net"
  ],
  "debug": false,                     // 是否输入debug信息
  "multipleResults": true             // 如果一个host查询到多个IP地址，是否要每一个都输出。（但是这样就不可以直接复制粘贴到hosts了）
}
``` 

例：
```bash
$ cat config.json 
{
  "hosts": [
    "github.com",
    "assets-cdn.github.com",
    "github.global.ssl.fastly.net"
  ],
  "debug": false,
  "multipleResults": false
}
$ node .
140.82.113.4 github.com
185.199.108.153 assets-cdn.github.com
199.232.69.194 github.global.ssl.fastly.net

# 然后把这三行复制到hosts中。Github访问速度飙升！
```
