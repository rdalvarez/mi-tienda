import React from "react";
import { GetStaticProps } from "next";
import {Box, Button, Grid, Link, Stack, Text} from "@chakra-ui/react"

import { Product } from "@/product/types";
import api from "@/product/api";


interface Props {
  products: Product[];
}

function parseCurrency(value: number): string{
  return value.toLocaleString('es-AR',{
    style: 'currency',
    currency: 'ARS'
  });
}

const IndexRoute: React.FC<Props> = ({products}) => {
  const [cart, setCart] = React.useState<Product[]>([]);
  const text = React.useMemo( () => {
    return cart
        .reduce(
          (message, product) => 
            message.concat(`* ${product.title} - ${parseCurrency(product.price)}\n`),
          ``,
        ).concat(`\nTotal: ${parseCurrency(cart.reduce( (total, product) => total + product.price, 0))}`);
  }, [cart]);

  function handleAddToCart(product: Product){
    setCart(cart=> cart.concat(product));
  }

  return (
    <Stack spacing={6}>
    <Grid gridGap={6} templateColumns="repeat(auto-fill, minmax(240px, 1fr))">
      {products.map( (product) => (
        <Stack
          key={product.id}
          borderRadius="md"
          backgroundColor="gray.100"
          spacing={3}
          padding={4}
          >
            <Stack spacing={1} >
            <Text>{product.title}</Text>
            <Text fontSize="sm" fontWeight="500" color="green.500">
              {parseCurrency(product.price)}
            </Text>
          </Stack>
          <Button
            colorScheme="primary"
            variant="outline"
            size="sm"
            onClick={() => handleAddToCart(product)}
          >
            Agregar
          </Button>
        </Stack>
      ))}
    </Grid>
    { Boolean(cart.length) && (
        <Box padding={4} margin="auto" position="sticky" bottom={0}>
          <Button
          isExternal
          as={Link}
          colorScheme="whatsapp"
          href={`https://wa.me/+5491140679999?text=${encodeURIComponent(text)}`}
          width="fit-content"
          >
          Completar pedido ({cart.length} productos)
        </Button>
        </Box>
      
    )}    
    </Stack>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const products = await api.list();
  console.log("Producto(0):", products[0]);
  console.log("Producto(1):", products[1]);
  return {
    revalidate: 10,
    props: {
      products,
    },
  }
}

export default IndexRoute;
