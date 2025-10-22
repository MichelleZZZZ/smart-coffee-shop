import { render, screen } from '@testing-library/react';
import ProductList from '../app/products/productList';
import { BLOCKS } from '@contentful/rich-text-types';
import '@testing-library/jest-dom';

const mockProducts = [
  {
    name: 'Espresso Beans',
    slug: 'espresso-beans',
    category: 'beans',
    description: {
      json: {
        nodeType: BLOCKS.DOCUMENT as any,
        data: {},
        content: [
          {
            nodeType: BLOCKS.PARAGRAPH as any,
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
        nodeType: BLOCKS.DOCUMENT as any,
        data: {},
        content: [
          {
            nodeType: BLOCKS.PARAGRAPH as any,
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
  render(<ProductList products={mockProducts as any} />);
  expect(screen.getByText('Espresso Beans')).toBeInTheDocument();
  expect(screen.getByText('Cold Brew')).toBeInTheDocument();
});

test('renders filter buttons', () => {
  render(<ProductList products={mockProducts as any} />);
  expect(screen.getByText('All')).toBeInTheDocument();
  expect(screen.getByText('Beans')).toBeInTheDocument();
  expect(screen.getByText('Drinks')).toBeInTheDocument();
  expect(screen.getByText('Equipment')).toBeInTheDocument();
});

test('renders product categories', () => {
  render(<ProductList products={mockProducts as any} />);
  expect(screen.getByText('beans')).toBeInTheDocument();
  expect(screen.getByText('drinks')).toBeInTheDocument();
});
