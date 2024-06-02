# Solution JWT

## None Alg

First, we access to ``None Alg`` level.

![alt text](image.png)

After we have successfully logged in, it will be granted a token.

![alt text](image-1.png)

And when we decode it with JWT Editor, it will look like this:

![alt text](image-2.png)

Ok ⇒ The alg parameter in the header is used to tell the server which algorithm was used to sign the token which he uses while verifying the signature. JWT Can be left unsigned. In this case, the ``alg`` parameter is set to ``none``. It’s called unsecured JWT ⇒ JWS without a signature. Next, we pay attention to payload part, there are three parameters we need to consider: ``id``, ``username`` and ``isAdmin``.

Exploit :
    
-   Change The alg parameter value: none.
-   Change the payload.
-   Remove the signature from the payload(keep the tailed dot).

Some times it’s not allowed to send the JWT with alg: none. Bypassed using classic obfuscation techniques, such as mixed capitalization and unexpected encodings.

![alt text](image-3.png)

Ok, we have got new JWT token ⇒ and now send it to the server.

``eyJ0eXAiOiJKV1QiLCJhbGciOiJub25lIn0.eyJpZCI6MiwidXNlcm5hbWUiOiJsZXRoYW5odHJvbmciLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE3MTU5NjM5MTh9.``

![alt text](image-4.png)

## Weak Key

Second, we access to ``Weak Key`` level.

![alt text](image-5.png)

After we have successfully logged, it will be granted a token.

![alt text](image-6.png)

Ok ⇒ Looking at it, we see token is signed with ``H2556`` algorithm. For those who don’t know, ``H256`` is symmetric algorithm, it uses one single secret key to both encryption and decryption. Next, we pay attention to payload part, there are three parameters we need to consider: ``id``, ``username`` and ``isAdmin``.

Because token uses symmetric algorithm, I try to guess secret key used to sign and verify token.

Here, i will use the ``hashcat`` tool to do get the key.

We need to prepare a token valid and wordlist to brute force, wordlist is ``jwt.secrets.list``.

![alt text](image-7.png)

Ok, we have got secret key ⇒ an now generate other valid token by secret key.

``eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJsZXRoYW5odHJvbmciLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE3MTU5NjYzNTF9.2bRh2ND5hj0Nvf5avCE071WSPHwbAMy2qF04GrU72SQ``

![alt text](image-8.png)

## Alg Confusion

Finally, ``Alg Confusion`` level.

![alt text](image-9.png)

Let's see the decode token.

![alt text](image-10.png)

See the difference ⇒ and I see the token is signed by asymmetric algorithm as ``RS256``

That algorithm uses one key pair follow: public key and private key, private key is used to signed token and public key is used to verify.

Exploit:

-   Obtain the server's public key.
-   Convert the public key to a suitable format.
-   Create a malicious JWT with a modified payload and the alg header set to HS256.
-   Sign the token with HS256, using the public key as the secret.

Obtain the server's public key ``/.well-known/jwks.json``.

![alt text](image-11.png)

```
{

    "keys": [

        {

            "kty": "RSA",

            "e": "AQAB",

            "kid": "6f597b7-fd81-44c7-956f-6937ea94cdf6",

            "n": "08q7VZbBa0y8MxwfrCvb2rq0jlUcDzzi3xoR38VRuoDjqlWXiQFjqounAIOcqHdCxwQxaKrF0wEScS0tkkyc8sfuYf06_5cYB-jqbifQbHNBeRRmsYzD6lmgbdfwXO5ugYNG-pasLEQxIklyjRi-lV_DdyBYL7f8vQJsIUu7Iga1w4BwbbAKYCRcuYk32xuX7BWxtpXpLEoHseb1q0B_mT6QixYqHiNstFBo-EBFbNnlpobBSXTGjYrAgfTMAqKv6GoNLEePJ9bY_rbSQV-gbO1FQ5MADm4ZT4S_Qcp7j5z_6DF1oUHHTn5ky5gMYFvbALGNiQiivY7gfSRib-WN7w"

        }

    ]

}
```

Although the server may expose their public key in JWK format, when verifying the signature of a token, it will use its own copy of the key from its local filesystem or database. This may be stored in a different format.

In order for the attack to work, the version of the key that you use to sign the JWT must be identical to the server's local copy.

Or you can just use it as it’s,but base-64 decoded.

Let's create a new ``RSA`` key by use the expose key.

![alt text](image-12.png)

Then copy it as PEM and encode with base-64.

![alt text](image-13.png)

Next, create a new ``Symmetric`` key and set the value encoded for ``k`` header.

![alt text](image-14.png)

Back to JSON Web Token, change ``alg`` from ``RS256`` to ``HS256`` and modify the payload.

The last, sign the token with ``Symmetric`` that we have just created.

![alt text](image-15.png)

So now the server validate the token with the ``signature`` provided by us and we get the ``Administrator``.

![alt text](image-16.png)