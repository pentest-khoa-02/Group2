## Preparation

Go to `/settings` and set SQLI status is `Login`

![alt text](image.png)

Let's go to `/page-login`

![alt text](image-1.png)

## Detect

In username input field, we insert `admin' or 1=1--`

![alt text](image-2.png)

And this is a result: `Do not hack`. So we think that server using blacklist or whitelist to filt user's input.

![alt text](image-3.png)

We try this: `admin' or '1'='1`

![alt text](image-4.png)

![alt text](image-5.png)

=> `or`, `--` maybe in blacklists?

We try another: `where`

![alt text](image-6.png)

We saw a error has information -> $prisma.queryRawUnsafe(), `where` is not in blacklist

Try this: `admin' union select null,null,null,null,null where '1'='1`. (You can try select null, null,... until it's doesn't show error `each UNION query must have the same number of columns`)

![alt text](image-7.png)

-> Data and hash? So we can insert another username and password to login?

We try this -> If it show error `Username or password is incorrect!` => type of column 1,2 is number. 3,4,5 is string.

![alt text](image-8.png)

Many web server use bcrypt to hash password, so we choose a password and hash this password.

We choose salt rounds is `10`. Password is `123` and this is hash password `123`.

![alt text](image-9.png)
