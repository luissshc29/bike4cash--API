# Bike4Cash API

This is the API for Bike4Cash, which allows users to browse bikes, get ratings, and view filtering methods for their frontend. The API is built using GraphQL and hosted on Vercel.

## API URL

The GraphQL API is available at:

```
https://bike4cash-api.vercel.app/
```

## Resolvers

### Bike Resolvers

The `Bike` object type represents a bike with the following fields:

```graphql
type Bike {
  id: Int!
  image: String!
  name: String!
  category: String!
  price: Int!
  rating: RatingInfo!
  recommended: Boolean!
}
```

- **id**: The unique identifier of the bike.
- **image**: A URL to the bike's image.
- **name**: The name of the bike.
- **category**: The category of the bike.
- **price**: The price of the bike.
- **rating**: The rating information (average and list of ratings).
- **recommended**: Whether the bike is recommended based on certain criteria.

#### RatingInfo Type

The `RatingInfo` object type represents the rating details of a bike:

```graphql
type RatingInfo {
  average: Float!
  list: [Rating]!
}
```

- **average**: The average rating of the bike.
- **list**: A list of individual ratings for the bike.

#### Rating Type

The `Rating` object type represents an individual bike rating:

```graphql
type Rating {
  id: Int!
  username: String!
  rating: Float!
  message: String!
}
```

- **id**: The unique identifier of the rating.
- **username**: The user who submitted the rating.
- **rating**: The numeric rating value.
- **message**: A message or review left by the user.

#### Bike Queries

- `bikes`: Returns a list of bikes, with optional filters.
- `bike`: Returns a single bike by its `id`.

```graphql
type Query {
  bikes(category: String, maxPrice: Int, search: String): [Bike]!
  bike(id: Int!): Bike!
}
```

- **category**: Filter bikes by category (e.g., "leisure", "recommended").
- **maxPrice**: Filter bikes under a specific price.
- **search**: Search for bikes by text.
- **bike (id: Int!)**: Fetches a bike by its unique ID.

### Category Resolvers

The `Category` object type represents a bike category with the following fields:

```graphql
type Category {
  id: Int!
  name: String!
  color: String!
}
```

- **id**: The unique identifier of the category.
- **name**: The name of the category.
- **color**: A color associated with the category for visual distinction.

#### Category Queries

- `categories`: Returns a list of all available categories.
- `category`: Returns a single category by its name.

```graphql
type Query {
  categories: [Category]!
  category(name: String!): Category
}
```

- **categories**: Fetches all bike categories.
- **category (name: String!)**: Fetches a category by its name.

## Usage

You can interact with the API using GraphQL queries. Below are some examples:

### Example Queries

1. **Get all bikes with a max price of 200:**

```graphql
{
  bikes(maxPrice: 200) {
    id
    name
    price
  }
}
```

2. **Get details of a specific bike by ID:**

```graphql
{
  bike(id: 1) {
    name
    category
    price
    rating {
      average
      list {
        username
        rating
        message
      }
    }
  }
}
```

3. **Get all categories:**

```graphql
{
  categories {
    id
    name
    color
  }
}
```

4. **Get a specific category by name:**

```graphql
{
  category(name: "Leisure") {
    id
    name
    color
  }
}
```

## Installation and Setup

To run the API locally, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/your-username/bike4cash-api.git
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. The API will be available at `http://localhost:4000`.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any bugs or feature requests.
