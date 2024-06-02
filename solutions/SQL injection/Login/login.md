## Preparation

Go to `/settings` and set SQLI is `Login`

![alt text](image.png)

## Detect

We use tool to detect SQL Injection in Login

After we enter URL to attack SQL Injection, there are some results:

![alt text](image-1.png)

Error `Do not hack!!!` -> `or` and `--` are in blacklists of server.

Scroll to buttom

![alt text](image-2.png)

Server is using prisma.$queryRawUnsafe().

Let's see `' union select null, null, null, null, null where '1' = '1`: `data and hash arguments required`

=> Server query 5 columns.

Next step, we will find type of column and where column is password

![alt text](image-3.png)

=> Type of column 1,2 is number. 3,4,5 is string

![alt text](image-4.png)

`data and hash is required` -> column 5 is password

## Exploit

Hash can be using bcrypt, we will try

![alt text](image-5.png)

![alt text](image-6.png)

And login!

![alt text](image-7.png)

Explain: Server get our inject account, and ‘$2a....O’ is hash password of ‘123’ by using bcrypt with 10 rounds. So server hash ‘123’ and compare with our password we inject.

Src code

![alt text](image-8.png)