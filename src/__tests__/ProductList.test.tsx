import { render, screen } from '@testing-library/react';
import ProductList from '../app/products/productList';
import '@testing-library/jest-dom';

// Define proper types for the mock data
type MockRichTextNode = {
  nodeType: string;
  data: Record<string, unknown>;
  content?: MockRichTextNode[];
  value?: string;
  marks?: unknown[];
};

type MockProduct = {
  name: string;
  slug: string;
  category: string;
  description: {
    json: MockRichTextNode;
  };
  image?: {
    url: string;
  };
};

const mockProducts: MockProduct[] = [
  {
    name: 'Espresso Beans',
    slug: 'espresso-beans',
    category: 'beans',
    description: {
      json: {
        nodeType: 'document',
        data: {},
        content: [
          {
            nodeType: 'paragraph',
            data: {},
            content: [
              {
                nodeType: 'text',
                value: 'Premium espresso beans for the perfect shot',
                marks: [],
                data: {}
              }
            ]
          }
        ]
      }
    },
    image: {
      url: 'https://example.com/espresso.jpg'
    }
  },
  {
    name: 'Cold Brew',
    slug: 'cold-brew',
    category: 'drinks',
    description: {
      json: {
        nodeType: 'document',
        data: {},
        content: [
          {
            nodeType: 'paragraph',
            data: {},
            content: [
              {
                nodeType: 'text',
                value: 'Smooth and refreshing cold brew coffee',
                marks: [],
                data: {}
              }
            ]
          }
        ]
      }
    },
    image: {
      url: 'https://example.com/coldbrew.jpg'
    }
  }
];

test('renders product names correctly', () => {
  render(<ProductList products={mockProducts as unknown as Parameters<typeof ProductList>[0]['products']} />);
  expect(screen.getByText('Espresso Beans')).toBeInTheDocument();
  expect(screen.getByText('Cold Brew')).toBeInTheDocument();
});

test('renders filter buttons', () => {
  render(<ProductList products={mockProducts as unknown as Parameters<typeof ProductList>[0]['products']} />);
  expect(screen.getByText('All')).toBeInTheDocument();
  expect(screen.getByText('Beans')).toBeInTheDocument();
  expect(screen.getByText('Drinks')).toBeInTheDocument();
  expect(screen.getByText('Equipment')).toBeInTheDocument();
});

test('renders product categories', () => {
  render(<ProductList products={mockProducts as unknown as Parameters<typeof ProductList>[0]['products']} />);
  expect(screen.getByText('beans')).toBeInTheDocument();
  expect(screen.getByText('drinks')).toBeInTheDocument();
});
