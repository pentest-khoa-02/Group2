# Blind SQL injection

Description: This is a Nodejs app with Postgresql. The database contains a table called ``Credential``, exploit and find out the password of ``lethanhtrong`` user.

First, we set the SQL injection status to ``Blind SQLI``.

![alt text](image.png)

## Detect

After setup, let's go to search something on search field.

![alt text](image-1.png)

We see, nothing as ``asd`` found. Let's inject some basic payload SQL injection like ``' or 1=1 --`` on it and look the result. The payload meaning:

 - ``'`` esacape query SQL
 - ``or 1=1`` the condition is always true, often used to bypass authentication or authorization checks.
 - ``--`` is the comment syntax in SQL to ignore everything behind.

![alt text](image-2.png)

The response is ``Found product!``. Because we set the true condition, so it will be display product on the response. So we can rely on this to inject query based on ``boolen-based``.

At this point, we can guess the query of server might be ``select * from products where product_name='input'``.

## Exploit

To exploit, we proceed to find the table have credential information. In this case, we found ``Credential`` table by the payload ``a' OR (SELECT 'a' FROM "Credential" LIMIT 1)='a``. The response is ``Found product!`` mean that is a true query and the table Credential is existed.

![alt text](image-3.png)

According to the description, we will check the username ``lethanhtrong`` exists or not. We realize that it exists because the response is ``Found product!``.

![alt text](image-4.png)

Next, we will check the length of ``password`` by ``a' OR (SELECT 'a' FROM "Credential" where username = 'lethanhtrong' and length(password) > 1 LIMIT 1)='a``. If the condition is true, confirm that the length of ``password`` is greater than 1. After a while increase the length of password to 60, mean ``length(password) > 60``, the condition is ``false``. Therefore, the length of ``password`` is 60 chars.

![alt text](image-5.png)

The last we will find out each character by ``substring``. The payload will be ``1' OR (SELECT SUBSTRING(password,1,1) FROM "Credential" WHERE username='lethanhtrong')='$``. The response is true, mean the first char is ``$``.

![alt text](image-6.png)

We continue fuzz the char in next position by ``Burp intruder``. Add the ``$`` into payload ``1' OR (SELECT SUBSTRING(password,§1§,1) FROM "Credential" WHERE username='lethanhtrong')='§$§``, change the mode to ``cluster bomb``.

![alt text](image-7.png)

Finally, we find out the password of username ``lethanhtrong`` is ``$2b$10$Rf/XWJRjqsO5pxKvwmtyLOxpO.hG03.Rxvr0wwLL8Z.koHQs9X5cy``.