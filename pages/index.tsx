import React from "react";
import { GetStaticProps } from "next";
import {Box, Button, Grid, Link, Stack, Text, Image, Flex} from "@chakra-ui/react"
import { motion, AnimatePresence, AnimateSharedLayout, LayoutGroup } from "framer-motion";

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
  const [selectedImage, setSelectedImage] = React.useState<string>('');
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
    <div>
      <LayoutGroup>
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
                    <Image
                      alt={product.title}
                      as={motion.img}
                      cursor="pointer"
                      layoutId={product.image}
                      maxHeight={128}
                      objectFit="cover"
                      borderTopRadius="md"
                      onClick={() => setSelectedImage(product.image)}
                      src={product.image}
                    />
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
          <AnimatePresence  mode="wait">
            { Boolean(cart.length) && (
              <Box
                initial={{scale:0}}
                animate={{scale:1}}
                exit={{scale:0}}
                as={motion.div}
                padding={4}
                margin="auto"
                position="sticky"
                bottom={0}>
                <Button
                  isExternal
                  as={Link}
                  size="lg"
                  colorScheme="whatsapp"
                  href={`https://wa.me/+5491140679999?text=${encodeURIComponent(text)}`}
                  width="fit-content"
                  leftIcon={<Image src="https://icongr.am/fontawesome/whatsapp.svg?size=32&color=ffffff" />}
                  >
                  Completar pedido ({cart.length} productos)
                </Button>
                <Button onClick={() => setCart([])}>
                  X
                </Button>
              </Box>
            )}    
          </AnimatePresence>
        </Stack>
      </LayoutGroup>
      <AnimatePresence>
        { selectedImage &&
          <Flex
            key="backdrop"
            alignItems="center"
            as={motion.div}
            backgroundColor="rgba(0,0,0,0.5)"
            justifyContent="center"
            layoutId={selectedImage}
            position="fixed"
            top={0}
            left={0}
            height="100%"
            width="100%"
            onClick={() => setSelectedImage('') }
          >
            <Image key="image" src={selectedImage} maxWidth={500} >
            </Image>
          </Flex>
        }
      </AnimatePresence>
      
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const products = await api.list();
  return {
    revalidate: 10,
    props: {
      products,
    },
  }
}

export default IndexRoute;
