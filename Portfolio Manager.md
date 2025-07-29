---
title: Portfolio Manager
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.30"

---

# Portfolio Manager

Base URLs:

# Authentication

# Users

## POST Login

POST /login

> Body 请求参数

```json
{
  "username": "string",
  "email": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» username|body|string| 是 |none|
|» email|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "user_id": "string"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» user_id|string|true|none||none|

## GET Get all users

GET /users

> 返回示例

> 200 Response

```json
[
  {
    "user_id": 0,
    "first_name": "string",
    "last_name": "string",
    "password": "stringst",
    "email": "user@example.com",
    "phone": "string",
    "created_at": "2019-08-24T14:15:22Z",
    "language": "string",
    "location": "string"
  }
]
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful operation|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|*anonymous*|[[User](#schemauser)]|false|none||none|
|» user_id|integer|true|none||Unique identifier for the user|
|» first_name|string|true|none||User's first name|
|» last_name|string|true|none||User's last name|
|» password|string|true|none||Hashed password|
|» email|string(email)|false|none||User's email address|
|» phone|string|false|none||none|
|» created_at|string(date-time)|false|none||Timestamp when user was created|
|» language|string|false|none||none|
|» location|string|false|none||none|

## POST Create a new user

POST /users

> Body 请求参数

```json
{
  "user_id": 0,
  "first_name": "string",
  "last_name": "string",
  "password": "stringst",
  "email": "user@example.com",
  "phone": "string",
  "created_at": "2019-08-24T14:15:22Z",
  "language": "string",
  "location": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» user_id|body|integer| 是 |Unique identifier for the user|
|» first_name|body|string| 是 |User's first name|
|» last_name|body|string| 是 |User's last name|
|» password|body|string| 是 |Hashed password|
|» email|body|string(email)| 否 |User's email address|
|» phone|body|string| 否 |none|
|» created_at|body|string(date-time)| 否 |Timestamp when user was created|
|» language|body|string| 否 |none|
|» location|body|string| 否 |none|

> 返回示例

> 201 Response

```json
{
  "user_id": 0,
  "first_name": "string",
  "last_name": "string",
  "password": "stringst",
  "email": "user@example.com",
  "phone": "string",
  "created_at": "2019-08-24T14:15:22Z",
  "language": "string",
  "location": "string"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|User created successfully|[User](#schemauser)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid input|Inline|

### 返回数据结构

状态码 **201**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» user_id|integer|true|none||Unique identifier for the user|
|» first_name|string|true|none||User's first name|
|» last_name|string|true|none||User's last name|
|» password|string|true|none||Hashed password|
|» email|string(email)|false|none||User's email address|
|» phone|string|false|none||none|
|» created_at|string(date-time)|false|none||Timestamp when user was created|
|» language|string|false|none||none|
|» location|string|false|none||none|

## GET Get user by ID

GET /users/{userId}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|userId|path|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "user_id": 0,
  "first_name": "string",
  "last_name": "string",
  "password": "stringst",
  "email": "user@example.com",
  "phone": "string",
  "created_at": "2019-08-24T14:15:22Z",
  "language": "string",
  "location": "string"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful operation|[User](#schemauser)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|User not found|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» user_id|integer|true|none||Unique identifier for the user|
|» first_name|string|true|none||User's first name|
|» last_name|string|true|none||User's last name|
|» password|string|true|none||Hashed password|
|» email|string(email)|false|none||User's email address|
|» phone|string|false|none||none|
|» created_at|string(date-time)|false|none||Timestamp when user was created|
|» language|string|false|none||none|
|» location|string|false|none||none|

## PUT Update user details

PUT /users/{userId}

> Body 请求参数

```json
{
  "user_id": 0,
  "first_name": "string",
  "last_name": "string",
  "password": "stringst",
  "email": "user@example.com",
  "phone": "string",
  "created_at": "2019-08-24T14:15:22Z",
  "language": "string",
  "location": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|userId|path|integer| 是 |none|
|body|body|[User](#schemauser)| 是 |none|

> 返回示例

> 200 Response

```json
{
  "user_id": 0,
  "first_name": "string",
  "last_name": "string",
  "password": "stringst",
  "email": "user@example.com",
  "phone": "string",
  "created_at": "2019-08-24T14:15:22Z",
  "language": "string",
  "location": "string"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|User updated|[User](#schemauser)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|User not found|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» user_id|integer|true|none||Unique identifier for the user|
|» first_name|string|true|none||User's first name|
|» last_name|string|true|none||User's last name|
|» password|string|true|none||Hashed password|
|» email|string(email)|false|none||User's email address|
|» phone|string|false|none||none|
|» created_at|string(date-time)|false|none||Timestamp when user was created|
|» language|string|false|none||none|
|» location|string|false|none||none|

## DELETE Delete a user

DELETE /users/{userId}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|userId|path|integer| 是 |none|

> 返回示例

> 204 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|User deleted|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|User not found|Inline|

### 返回数据结构

# Stocks

## GET Get all stocks

GET /stocks

> 返回示例

> 200 Response

```json
[
  {
    "stock_id": 0,
    "symbol": "string",
    "company_name": "string",
    "current_price": 0,
    "last_updated": "2019-08-24T14:15:22Z",
    "exchange": "string",
    "volume": "string",
    "sector": "string",
    "market_cap": "string",
    "company_info": "string",
    "in_list": true,
    "history_price": [
      {
        "date": "string",
        "price": 0
      }
    ]
  }
]
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful operation|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|*anonymous*|[[Stock](#schemastock)]|false|none||none|
|» stock_id|integer|true|none||Unique identifier for the stock|
|» symbol|string|true|none||Stock ticker symbol|
|» company_name|string|true|none||Full company name|
|» current_price|number|false|none||Current market price|
|» last_updated|string(date-time)|false|none||When price was last updated|
|» exchange|string|false|none||Which exchange is in|
|» volume|string|false|none||none|
|» sector|string|false|none||none|
|» market_cap|string|false|none||none|
|» company_info|string|false|none||none|
|» in_list|boolean|false|none||none|
|» history_price|[object]|false|none||none|
|»» date|string|false|none||none|
|»» price|integer|false|none||none|

## GET Get stock by ID

GET /stocks/{stockId}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|stockId|path|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "stock_id": 0,
  "symbol": "string",
  "company_name": "string",
  "current_price": 0,
  "last_updated": "2019-08-24T14:15:22Z",
  "exchange": "string",
  "volume": "string",
  "sector": "string",
  "market_cap": "string",
  "company_info": "string",
  "in_list": true,
  "history_price": [
    {
      "date": "string",
      "price": 0
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful operation|[Stock](#schemastock)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Stock not found|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» stock_id|integer|true|none||Unique identifier for the stock|
|» symbol|string|true|none||Stock ticker symbol|
|» company_name|string|true|none||Full company name|
|» current_price|number|false|none||Current market price|
|» last_updated|string(date-time)|false|none||When price was last updated|
|» exchange|string|false|none||Which exchange is in|
|» volume|string|false|none||none|
|» sector|string|false|none||none|
|» market_cap|string|false|none||none|
|» company_info|string|false|none||none|
|» in_list|boolean|false|none||none|
|» history_price|[object]|false|none||none|
|»» date|string|false|none||none|
|»» price|integer|false|none||none|

# Portfolio

## GET Get user's portfolio summary

GET /users/{userId}/portfolio

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|userId|path|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "total_value": 0,
  "cash_balance": 0,
  "stock_value": 0,
  "holdings": [
    {
      "holding_id": 0,
      "user_id": 0,
      "stock_id": 0,
      "holding_number": 0,
      "average_price": 0.01,
      "holding_list": [
        {
          "stock_id": 0,
          "symbol": "string",
          "company_name": "string",
          "current_price": 0,
          "last_updated": "2019-08-24T14:15:22Z",
          "exchange": "string",
          "volume": "string",
          "sector": "string",
          "market_cap": "string",
          "company_info": "string",
          "in_list": true,
          "history_price": [
            {}
          ],
          "added_at": "2019-08-24T14:15:22Z"
        }
      ],
      "cash": 0,
      "total_value": 0,
      "last_updated": "2019-08-24T14:15:22Z"
    }
  ],
  "last_updated": "2019-08-24T14:15:22Z"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Portfolio data|[PortfolioSummary](#schemaportfoliosummary)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|User not found|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» total_value|number|true|none||Total portfolio value|
|» cash_balance|number|true|none||Available cash|
|» stock_value|number|true|none||Value of stock holdings|
|» holdings|[[Holding](#schemaholding)]|false|none||none|
|»» holding_id|integer|false|none||Unique identifier for the holding|
|»» user_id|integer|true|none||Reference to user|
|»» stock_id|integer|true|none||Reference to stock|
|»» holding_number|integer|true|none||Total shares held|
|»» average_price|number|true|none||Average purchase price|
|»» holding_list|[object]|true|none||none|
|»»» stock_id|integer|true|none||Unique identifier for the stock|
|»»» symbol|string|true|none||Stock ticker symbol|
|»»» company_name|string|true|none||Full company name|
|»»» current_price|number|false|none||Current market price|
|»»» last_updated|string(date-time)|false|none||When price was last updated|
|»»» exchange|string|false|none||Which exchange is in|
|»»» volume|string|false|none||none|
|»»» sector|string|false|none||none|
|»»» market_cap|string|false|none||none|
|»»» company_info|string|false|none||none|
|»»» in_list|boolean|false|none||none|
|»»» history_price|[object]|false|none||none|
|»»»» date|string|false|none||none|
|»»»» price|integer|false|none||none|
|»»» added_at|string(date-time)|false|none||none|
|»» cash|integer|true|none||none|
|»» total_value|integer|true|none||none|
|»» last_updated|string(date-time)|false|none||When holding was last updated|
|» last_updated|string(date-time)|false|none||none|

## GET Get net worth history

GET /users/{userId}/net-worth

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|userId|path|integer| 是 |none|
|period|query|string| 否 |Time period for history|

#### 枚举值

|属性|值|
|---|---|
|period|1d|
|period|1w|
|period|1m|
|period|3m|
|period|6m|
|period|1y|

> 返回示例

> 200 Response

```json
[
  {
    "net_worth_id": 0,
    "user_id": 0,
    "total_balance": 0,
    "stock_value": 0,
    "date_recorded": "2019-08-24"
  }
]
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Net worth history|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|User not found|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|*anonymous*|[[NetWorth](#schemanetworth)]|false|none||none|
|» net_worth_id|integer|false|none||Unique identifier for the record|
|» user_id|integer|true|none||Reference to user|
|» total_balance|number|true|none||Total net worth amount|
|» stock_value|number|true|none||Value of stock holdings|
|» date_recorded|string(date)|true|none||Date of the record|

## GET Get all holdings for a user

GET /users/{userId}/holdings

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|userId|path|integer| 是 |none|

> 返回示例

> 200 Response

```json
[
  {
    "holding_id": 0,
    "user_id": 0,
    "stock_id": 0,
    "holding_number": 0,
    "average_price": 0.01,
    "holding_list": [
      {
        "stock_id": 0,
        "symbol": "string",
        "company_name": "string",
        "current_price": 0,
        "last_updated": "2019-08-24T14:15:22Z",
        "exchange": "string",
        "volume": "string",
        "sector": "string",
        "market_cap": "string",
        "company_info": "string",
        "in_list": true,
        "history_price": [
          {
            "date": "string",
            "price": 0
          }
        ],
        "added_at": "2019-08-24T14:15:22Z"
      }
    ],
    "cash": 0,
    "total_value": 0,
    "last_updated": "2019-08-24T14:15:22Z"
  }
]
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|List of holdings|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|User not found|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|*anonymous*|[[Holding](#schemaholding)]|false|none||none|
|» holding_id|integer|false|none||Unique identifier for the holding|
|» user_id|integer|true|none||Reference to user|
|» stock_id|integer|true|none||Reference to stock|
|» holding_number|integer|true|none||Total shares held|
|» average_price|number|true|none||Average purchase price|
|» holding_list|[object]|true|none||none|
|»» stock_id|integer|true|none||Unique identifier for the stock|
|»» symbol|string|true|none||Stock ticker symbol|
|»» company_name|string|true|none||Full company name|
|»» current_price|number|false|none||Current market price|
|»» last_updated|string(date-time)|false|none||When price was last updated|
|»» exchange|string|false|none||Which exchange is in|
|»» volume|string|false|none||none|
|»» sector|string|false|none||none|
|»» market_cap|string|false|none||none|
|»» company_info|string|false|none||none|
|»» in_list|boolean|false|none||none|
|»» history_price|[object]|false|none||none|
|»»» date|string|false|none||none|
|»»» price|integer|false|none||none|
|»» added_at|string(date-time)|false|none||none|
|» cash|integer|true|none||none|
|» total_value|integer|true|none||none|
|» last_updated|string(date-time)|false|none||When holding was last updated|

## GET Get holding by ID

GET /holdings/{holdingId}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|holdingId|path|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "holding_id": 0,
  "user_id": 0,
  "stock_id": 0,
  "holding_number": 0,
  "average_price": 0.01,
  "holding_list": [
    {
      "stock_id": 0,
      "symbol": "string",
      "company_name": "string",
      "current_price": 0,
      "last_updated": "2019-08-24T14:15:22Z",
      "exchange": "string",
      "volume": "string",
      "sector": "string",
      "market_cap": "string",
      "company_info": "string",
      "in_list": true,
      "history_price": [
        {
          "date": "string",
          "price": 0
        }
      ],
      "added_at": "2019-08-24T14:15:22Z"
    }
  ],
  "cash": 0,
  "total_value": 0,
  "last_updated": "2019-08-24T14:15:22Z"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Holding details|[Holding](#schemaholding)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Holding not found|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» holding_id|integer|false|none||Unique identifier for the holding|
|» user_id|integer|true|none||Reference to user|
|» stock_id|integer|true|none||Reference to stock|
|» holding_number|integer|true|none||Total shares held|
|» average_price|number|true|none||Average purchase price|
|» holding_list|[object]|true|none||none|
|»» stock_id|integer|true|none||Unique identifier for the stock|
|»» symbol|string|true|none||Stock ticker symbol|
|»» company_name|string|true|none||Full company name|
|»» current_price|number|false|none||Current market price|
|»» last_updated|string(date-time)|false|none||When price was last updated|
|»» exchange|string|false|none||Which exchange is in|
|»» volume|string|false|none||none|
|»» sector|string|false|none||none|
|»» market_cap|string|false|none||none|
|»» company_info|string|false|none||none|
|»» in_list|boolean|false|none||none|
|»» history_price|[object]|false|none||none|
|»»» date|string|false|none||none|
|»»» price|integer|false|none||none|
|»» added_at|string(date-time)|false|none||none|
|» cash|integer|true|none||none|
|» total_value|integer|true|none||none|
|» last_updated|string(date-time)|false|none||When holding was last updated|

## DELETE Delete a holding (sell all shares)

DELETE /holdings/{holdingId}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|holdingId|path|integer| 是 |none|

> 返回示例

> 204 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Holding deleted|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Holding not found|Inline|

### 返回数据结构

# Orders

## POST Create a new order

POST /orders

> Body 请求参数

```json
{
  "order_id": 0,
  "user_id": 0,
  "stock_id": 0,
  "order_type": "BUY",
  "quantity": 1,
  "price_per_share": 0.01,
  "total_value": 0,
  "date": "2019-08-24T14:15:22Z",
  "status": "PENDING",
  "duration": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[Order](#schemaorder)| 是 |none|

> 返回示例

> 201 Response

```json
{
  "order_id": 0,
  "user_id": 0,
  "stock_id": 0,
  "order_type": "BUY",
  "quantity": 1,
  "price_per_share": 0.01,
  "total_value": 0,
  "date": "2019-08-24T14:15:22Z",
  "status": "PENDING",
  "duration": "string"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Order created|[Order](#schemaorder)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid order|Inline|

### 返回数据结构

状态码 **201**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» order_id|integer|true|none||Unique identifier for the order|
|» user_id|integer|true|none||Reference to user|
|» stock_id|integer|true|none||Reference to stock|
|» order_type|string|true|none||Type of order|
|» quantity|integer|true|none||Number of shares|
|» price_per_share|number|true|none||Price per share at order time|
|» total_value|integer|true|none||none|
|» date|string(date-time)|false|none||When order was placed|
|» status|string|false|none||Order status|
|» duration|string|false|none||none|

#### 枚举值

|属性|值|
|---|---|
|order_type|BUY|
|order_type|SELL|
|status|PENDING|
|status|EXECUTED|
|status|CANCELLED|

## GET Get all orders (admin only)

GET /orders

> 返回示例

> 200 Response

```json
[
  {
    "order_id": 0,
    "user_id": 0,
    "stock_id": 0,
    "order_type": "BUY",
    "quantity": 1,
    "price_per_share": 0.01,
    "total_value": 0,
    "date": "2019-08-24T14:15:22Z",
    "status": "PENDING",
    "duration": "string"
  }
]
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|List of orders|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|*anonymous*|[[Order](#schemaorder)]|false|none||none|
|» order_id|integer|true|none||Unique identifier for the order|
|» user_id|integer|true|none||Reference to user|
|» stock_id|integer|true|none||Reference to stock|
|» order_type|string|true|none||Type of order|
|» quantity|integer|true|none||Number of shares|
|» price_per_share|number|true|none||Price per share at order time|
|» total_value|integer|true|none||none|
|» date|string(date-time)|false|none||When order was placed|
|» status|string|false|none||Order status|
|» duration|string|false|none||none|

#### 枚举值

|属性|值|
|---|---|
|order_type|BUY|
|order_type|SELL|
|status|PENDING|
|status|EXECUTED|
|status|CANCELLED|

## GET Get orders for a user

GET /users/{userId}/orders

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|userId|path|integer| 是 |none|

> 返回示例

> 200 Response

```json
[
  {
    "order_id": 0,
    "user_id": 0,
    "stock_id": 0,
    "order_type": "BUY",
    "quantity": 1,
    "price_per_share": 0.01,
    "total_value": 0,
    "date": "2019-08-24T14:15:22Z",
    "status": "PENDING",
    "duration": "string"
  }
]
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|List of user's orders|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|User not found|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|*anonymous*|[[Order](#schemaorder)]|false|none||none|
|» order_id|integer|true|none||Unique identifier for the order|
|» user_id|integer|true|none||Reference to user|
|» stock_id|integer|true|none||Reference to stock|
|» order_type|string|true|none||Type of order|
|» quantity|integer|true|none||Number of shares|
|» price_per_share|number|true|none||Price per share at order time|
|» total_value|integer|true|none||none|
|» date|string(date-time)|false|none||When order was placed|
|» status|string|false|none||Order status|
|» duration|string|false|none||none|

#### 枚举值

|属性|值|
|---|---|
|order_type|BUY|
|order_type|SELL|
|status|PENDING|
|status|EXECUTED|
|status|CANCELLED|

## GET Get order by ID

GET /orders/{orderId}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|orderId|path|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "order_id": 0,
  "user_id": 0,
  "stock_id": 0,
  "order_type": "BUY",
  "quantity": 1,
  "price_per_share": 0.01,
  "total_value": 0,
  "date": "2019-08-24T14:15:22Z",
  "status": "PENDING",
  "duration": "string"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Order details|[Order](#schemaorder)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Order not found|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» order_id|integer|true|none||Unique identifier for the order|
|» user_id|integer|true|none||Reference to user|
|» stock_id|integer|true|none||Reference to stock|
|» order_type|string|true|none||Type of order|
|» quantity|integer|true|none||Number of shares|
|» price_per_share|number|true|none||Price per share at order time|
|» total_value|integer|true|none||none|
|» date|string(date-time)|false|none||When order was placed|
|» status|string|false|none||Order status|
|» duration|string|false|none||none|

#### 枚举值

|属性|值|
|---|---|
|order_type|BUY|
|order_type|SELL|
|status|PENDING|
|status|EXECUTED|
|status|CANCELLED|

## PUT Update order status

PUT /orders/{orderId}

> Body 请求参数

```json
{
  "status": "PENDING"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|orderId|path|integer| 是 |none|
|body|body|object| 是 |none|
|» status|body|string| 是 |none|

#### 枚举值

|属性|值|
|---|---|
|» status|PENDING|
|» status|EXECUTED|
|» status|CANCELLED|

> 返回示例

> 200 Response

```json
{
  "order_id": 0,
  "user_id": 0,
  "stock_id": 0,
  "order_type": "BUY",
  "quantity": 1,
  "price_per_share": 0.01,
  "total_value": 0,
  "date": "2019-08-24T14:15:22Z",
  "status": "PENDING",
  "duration": "string"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Order updated|[Order](#schemaorder)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Order not found|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» order_id|integer|true|none||Unique identifier for the order|
|» user_id|integer|true|none||Reference to user|
|» stock_id|integer|true|none||Reference to stock|
|» order_type|string|true|none||Type of order|
|» quantity|integer|true|none||Number of shares|
|» price_per_share|number|true|none||Price per share at order time|
|» total_value|integer|true|none||none|
|» date|string(date-time)|false|none||When order was placed|
|» status|string|false|none||Order status|
|» duration|string|false|none||none|

#### 枚举值

|属性|值|
|---|---|
|order_type|BUY|
|order_type|SELL|
|status|PENDING|
|status|EXECUTED|
|status|CANCELLED|

# Watchlist

## GET Get user's watchlist

GET /users/{userId}/watchlist

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|userId|path|integer| 是 |none|

> 返回示例

> 200 Response

```json
[
  {
    "watchlist_id": 0,
    "user_id": 0,
    "stock_list": [
      {
        "stock_id": 0,
        "symbol": "string",
        "company_name": "string",
        "current_price": 0,
        "last_updated": "2019-08-24T14:15:22Z",
        "exchange": "string",
        "volume": "string",
        "sector": "string",
        "market_cap": "string",
        "company_info": "string",
        "in_list": true,
        "history_price": [
          {
            "date": "string",
            "price": 0
          }
        ],
        "added_at": "2019-08-24T14:15:22Z"
      }
    ],
    "display_name": "string",
    "created_at": "2019-08-24T14:15:22Z"
  }
]
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Watchlist items|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|User not found|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|*anonymous*|[[Watchlist](#schemawatchlist)]|false|none||none|
|» watchlist_id|integer|false|none||Unique identifier for the watchlist item|
|» user_id|integer|true|none||Reference to user|
|» stock_list|[object]|true|none||Reference to stock|
|»» stock_id|integer|true|none||Unique identifier for the stock|
|»» symbol|string|true|none||Stock ticker symbol|
|»» company_name|string|true|none||Full company name|
|»» current_price|number|false|none||Current market price|
|»» last_updated|string(date-time)|false|none||When price was last updated|
|»» exchange|string|false|none||Which exchange is in|
|»» volume|string|false|none||none|
|»» sector|string|false|none||none|
|»» market_cap|string|false|none||none|
|»» company_info|string|false|none||none|
|»» in_list|boolean|false|none||none|
|»» history_price|[object]|false|none||none|
|»»» date|string|false|none||none|
|»»» price|integer|false|none||none|
|»» added_at|string(date-time)|false|none||none|
|» display_name|string|false|none||Custom display name|
|» created_at|string(date-time)|false|none||When watchlist was created|

## POST Add item to watchlist

POST /users/{userId}/watchlist

> Body 请求参数

```json
{
  "watchlist_id": 0,
  "user_id": 0,
  "stock_list": [
    {
      "stock_id": 0,
      "symbol": "string",
      "company_name": "string",
      "current_price": 0,
      "last_updated": "2019-08-24T14:15:22Z",
      "exchange": "string",
      "volume": "string",
      "sector": "string",
      "market_cap": "string",
      "company_info": "string",
      "in_list": true,
      "history_price": [
        {
          "date": "string",
          "price": 0
        }
      ],
      "added_at": "2019-08-24T14:15:22Z"
    }
  ],
  "display_name": "string",
  "created_at": "2019-08-24T14:15:22Z"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|userId|path|integer| 是 |none|
|body|body|[Watchlist](#schemawatchlist)| 是 |none|

> 返回示例

> 201 Response

```json
{
  "watchlist_id": 0,
  "user_id": 0,
  "stock_list": [
    {
      "stock_id": 0,
      "symbol": "string",
      "company_name": "string",
      "current_price": 0,
      "last_updated": "2019-08-24T14:15:22Z",
      "exchange": "string",
      "volume": "string",
      "sector": "string",
      "market_cap": "string",
      "company_info": "string",
      "in_list": true,
      "history_price": [
        {
          "date": "string",
          "price": 0
        }
      ],
      "added_at": "2019-08-24T14:15:22Z"
    }
  ],
  "display_name": "string",
  "created_at": "2019-08-24T14:15:22Z"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Item added to watchlist|[Watchlist](#schemawatchlist)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid input|Inline|

### 返回数据结构

状态码 **201**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» watchlist_id|integer|false|none||Unique identifier for the watchlist item|
|» user_id|integer|true|none||Reference to user|
|» stock_list|[object]|true|none||Reference to stock|
|»» stock_id|integer|true|none||Unique identifier for the stock|
|»» symbol|string|true|none||Stock ticker symbol|
|»» company_name|string|true|none||Full company name|
|»» current_price|number|false|none||Current market price|
|»» last_updated|string(date-time)|false|none||When price was last updated|
|»» exchange|string|false|none||Which exchange is in|
|»» volume|string|false|none||none|
|»» sector|string|false|none||none|
|»» market_cap|string|false|none||none|
|»» company_info|string|false|none||none|
|»» in_list|boolean|false|none||none|
|»» history_price|[object]|false|none||none|
|»»» date|string|false|none||none|
|»»» price|integer|false|none||none|
|»» added_at|string(date-time)|false|none||none|
|» display_name|string|false|none||Custom display name|
|» created_at|string(date-time)|false|none||When watchlist was created|

## DELETE Remove item from watchlist

DELETE /watchlist/{watchlistId}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|watchlistId|path|integer| 是 |none|

> 返回示例

> 204 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Item removed|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Item not found|Inline|

### 返回数据结构

# Trash Bin

## GET Get watchlist item by ID

GET /watchlist/{watchlistId}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|watchlistId|path|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "watchlist_id": 0,
  "user_id": 0,
  "stock_list": [
    {
      "stock_id": 0,
      "symbol": "string",
      "company_name": "string",
      "current_price": 0,
      "last_updated": "2019-08-24T14:15:22Z",
      "exchange": "string",
      "volume": "string",
      "sector": "string",
      "market_cap": "string",
      "company_info": "string",
      "in_list": true,
      "history_price": [
        {
          "date": "string",
          "price": 0
        }
      ],
      "added_at": "2019-08-24T14:15:22Z"
    }
  ],
  "display_name": "string",
  "created_at": "2019-08-24T14:15:22Z"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Watchlist item details|[Watchlist](#schemawatchlist)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Item not found|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» watchlist_id|integer|false|none||Unique identifier for the watchlist item|
|» user_id|integer|true|none||Reference to user|
|» stock_list|[object]|true|none||Reference to stock|
|»» stock_id|integer|true|none||Unique identifier for the stock|
|»» symbol|string|true|none||Stock ticker symbol|
|»» company_name|string|true|none||Full company name|
|»» current_price|number|false|none||Current market price|
|»» last_updated|string(date-time)|false|none||When price was last updated|
|»» exchange|string|false|none||Which exchange is in|
|»» volume|string|false|none||none|
|»» sector|string|false|none||none|
|»» market_cap|string|false|none||none|
|»» company_info|string|false|none||none|
|»» in_list|boolean|false|none||none|
|»» history_price|[object]|false|none||none|
|»»» date|string|false|none||none|
|»»» price|integer|false|none||none|
|»» added_at|string(date-time)|false|none||none|
|» display_name|string|false|none||Custom display name|
|» created_at|string(date-time)|false|none||When watchlist was created|

# 数据模型

<h2 id="tocS_User">User</h2>

<a id="schemauser"></a>
<a id="schema_User"></a>
<a id="tocSuser"></a>
<a id="tocsuser"></a>

```json
{
  "user_id": 0,
  "first_name": "string",
  "last_name": "string",
  "password": "stringst",
  "email": "user@example.com",
  "phone": "string",
  "created_at": "2019-08-24T14:15:22Z",
  "language": "string",
  "location": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|user_id|integer|true|none||Unique identifier for the user|
|first_name|string|true|none||User's first name|
|last_name|string|true|none||User's last name|
|password|string|true|none||Hashed password|
|email|string(email)|false|none||User's email address|
|phone|string|false|none||none|
|created_at|string(date-time)|false|none||Timestamp when user was created|
|language|string|false|none||none|
|location|string|false|none||none|

<h2 id="tocS_Stock">Stock</h2>

<a id="schemastock"></a>
<a id="schema_Stock"></a>
<a id="tocSstock"></a>
<a id="tocsstock"></a>

```json
{
  "stock_id": 0,
  "symbol": "string",
  "company_name": "string",
  "current_price": 0,
  "last_updated": "2019-08-24T14:15:22Z",
  "exchange": "string",
  "volume": "string",
  "sector": "string",
  "market_cap": "string",
  "company_info": "string",
  "in_list": true,
  "history_price": [
    {
      "date": "string",
      "price": 0
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|stock_id|integer|true|none||Unique identifier for the stock|
|symbol|string|true|none||Stock ticker symbol|
|company_name|string|true|none||Full company name|
|current_price|number|false|none||Current market price|
|last_updated|string(date-time)|false|none||When price was last updated|
|exchange|string|false|none||Which exchange is in|
|volume|string|false|none||none|
|sector|string|false|none||none|
|market_cap|string|false|none||none|
|company_info|string|false|none||none|
|in_list|boolean|false|none||none|
|history_price|[object]|false|none||none|
|» date|string|false|none||none|
|» price|integer|false|none||none|

<h2 id="tocS_Order">Order</h2>

<a id="schemaorder"></a>
<a id="schema_Order"></a>
<a id="tocSorder"></a>
<a id="tocsorder"></a>

```json
{
  "order_id": 0,
  "user_id": 0,
  "stock_id": 0,
  "order_type": "BUY",
  "quantity": 1,
  "price_per_share": 0.01,
  "total_value": 0,
  "date": "2019-08-24T14:15:22Z",
  "status": "PENDING",
  "duration": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|order_id|integer|true|none||Unique identifier for the order|
|user_id|integer|true|none||Reference to user|
|stock_id|integer|true|none||Reference to stock|
|order_type|string|true|none||Type of order|
|quantity|integer|true|none||Number of shares|
|price_per_share|number|true|none||Price per share at order time|
|total_value|integer|true|none||none|
|date|string(date-time)|false|none||When order was placed|
|status|string|false|none||Order status|
|duration|string|false|none||none|

#### 枚举值

|属性|值|
|---|---|
|order_type|BUY|
|order_type|SELL|
|status|PENDING|
|status|EXECUTED|
|status|CANCELLED|

<h2 id="tocS_Holding">Holding</h2>

<a id="schemaholding"></a>
<a id="schema_Holding"></a>
<a id="tocSholding"></a>
<a id="tocsholding"></a>

```json
{
  "holding_id": 0,
  "user_id": 0,
  "stock_id": 0,
  "holding_number": 0,
  "average_price": 0.01,
  "holding_list": [
    {
      "stock_id": 0,
      "symbol": "string",
      "company_name": "string",
      "current_price": 0,
      "last_updated": "2019-08-24T14:15:22Z",
      "exchange": "string",
      "volume": "string",
      "sector": "string",
      "market_cap": "string",
      "company_info": "string",
      "in_list": true,
      "history_price": [
        {
          "date": "string",
          "price": 0
        }
      ],
      "added_at": "2019-08-24T14:15:22Z"
    }
  ],
  "cash": 0,
  "total_value": 0,
  "last_updated": "2019-08-24T14:15:22Z"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|holding_id|integer|false|none||Unique identifier for the holding|
|user_id|integer|true|none||Reference to user|
|stock_id|integer|true|none||Reference to stock|
|holding_number|integer|true|none||Total shares held|
|average_price|number|true|none||Average purchase price|
|holding_list|[object]|true|none||none|
|» stock_id|integer|true|none||Unique identifier for the stock|
|» symbol|string|true|none||Stock ticker symbol|
|» company_name|string|true|none||Full company name|
|» current_price|number|false|none||Current market price|
|» last_updated|string(date-time)|false|none||When price was last updated|
|» exchange|string|false|none||Which exchange is in|
|» volume|string|false|none||none|
|» sector|string|false|none||none|
|» market_cap|string|false|none||none|
|» company_info|string|false|none||none|
|» in_list|boolean|false|none||none|
|» history_price|[object]|false|none||none|
|»» date|string|false|none||none|
|»» price|integer|false|none||none|
|» added_at|string(date-time)|false|none||none|
|cash|integer|true|none||none|
|total_value|integer|true|none||none|
|last_updated|string(date-time)|false|none||When holding was last updated|

<h2 id="tocS_Watchlist">Watchlist</h2>

<a id="schemawatchlist"></a>
<a id="schema_Watchlist"></a>
<a id="tocSwatchlist"></a>
<a id="tocswatchlist"></a>

```json
{
  "watchlist_id": 0,
  "user_id": 0,
  "stock_list": [
    {
      "stock_id": 0,
      "symbol": "string",
      "company_name": "string",
      "current_price": 0,
      "last_updated": "2019-08-24T14:15:22Z",
      "exchange": "string",
      "volume": "string",
      "sector": "string",
      "market_cap": "string",
      "company_info": "string",
      "in_list": true,
      "history_price": [
        {
          "date": "string",
          "price": 0
        }
      ],
      "added_at": "2019-08-24T14:15:22Z"
    }
  ],
  "display_name": "string",
  "created_at": "2019-08-24T14:15:22Z"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|watchlist_id|integer|false|none||Unique identifier for the watchlist item|
|user_id|integer|true|none||Reference to user|
|stock_list|[object]|true|none||Reference to stock|
|» stock_id|integer|true|none||Unique identifier for the stock|
|» symbol|string|true|none||Stock ticker symbol|
|» company_name|string|true|none||Full company name|
|» current_price|number|false|none||Current market price|
|» last_updated|string(date-time)|false|none||When price was last updated|
|» exchange|string|false|none||Which exchange is in|
|» volume|string|false|none||none|
|» sector|string|false|none||none|
|» market_cap|string|false|none||none|
|» company_info|string|false|none||none|
|» in_list|boolean|false|none||none|
|» history_price|[object]|false|none||none|
|»» date|string|false|none||none|
|»» price|integer|false|none||none|
|» added_at|string(date-time)|false|none||none|
|display_name|string|false|none||Custom display name|
|created_at|string(date-time)|false|none||When watchlist was created|

<h2 id="tocS_PortfolioSummary">PortfolioSummary</h2>

<a id="schemaportfoliosummary"></a>
<a id="schema_PortfolioSummary"></a>
<a id="tocSportfoliosummary"></a>
<a id="tocsportfoliosummary"></a>

```json
{
  "total_value": 0,
  "cash_balance": 0,
  "stock_value": 0,
  "holdings": [
    {
      "holding_id": 0,
      "user_id": 0,
      "stock_id": 0,
      "holding_number": 0,
      "average_price": 0.01,
      "holding_list": [
        {
          "stock_id": 0,
          "symbol": "string",
          "company_name": "string",
          "current_price": 0,
          "last_updated": "2019-08-24T14:15:22Z",
          "exchange": "string",
          "volume": "string",
          "sector": "string",
          "market_cap": "string",
          "company_info": "string",
          "in_list": true,
          "history_price": [
            {}
          ],
          "added_at": "2019-08-24T14:15:22Z"
        }
      ],
      "cash": 0,
      "total_value": 0,
      "last_updated": "2019-08-24T14:15:22Z"
    }
  ],
  "last_updated": "2019-08-24T14:15:22Z"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|total_value|number|true|none||Total portfolio value|
|cash_balance|number|true|none||Available cash|
|stock_value|number|true|none||Value of stock holdings|
|holdings|[[Holding](#schemaholding)]|false|none||none|
|last_updated|string(date-time)|false|none||none|

<h2 id="tocS_NetWorth">NetWorth</h2>

<a id="schemanetworth"></a>
<a id="schema_NetWorth"></a>
<a id="tocSnetworth"></a>
<a id="tocsnetworth"></a>

```json
{
  "net_worth_id": 0,
  "user_id": 0,
  "total_balance": 0,
  "stock_value": 0,
  "date_recorded": "2019-08-24"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|net_worth_id|integer|false|none||Unique identifier for the record|
|user_id|integer|true|none||Reference to user|
|total_balance|number|true|none||Total net worth amount|
|stock_value|number|true|none||Value of stock holdings|
|date_recorded|string(date)|true|none||Date of the record|

