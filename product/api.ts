import axios from "axios";
import { Product } from './types';
import Papa from "papaparse";
import { isNumber } from "@chakra-ui/utils";

export default {
    list: async (): Promise<Product[]> =>{
        return axios
        .get(
            `https://docs.google.com/spreadsheets/d/e/2PACX-1vTI4NV8fMQ7wK8dCs0gUytMv8tMBD7jdMIj8HB8DucqoocAqRwydl7UbVmEk3hBD6Q7Zw8qYpJ-LJtd/pub?output=csv`,
            {
                responseType: 'blob'
            }
        ).then( (response) =>{
            return new Promise<Product[]>((resolve, reject) => {
                Papa.parse(response.data, {
                    header: true,
                    complete: (results) =>{
                       const products = results.data as Product[];
                       
                       return resolve(
                            products.map(
                                product => ({
                                    ...product,
                                    price: Number(product.price.toString().replace(",",".")),
                                })
                            )
                        )
                    },
                    error: (error) =>{
                        return reject(error.message);
                    }
                });
                
                // Papa.parse(response.data, {
                //     header: true,
                //     complete: (results) =>{
                //         return resolve(results.data as Product[]);
                //     },
                //     error: (error) =>{
                //         return reject(error.message);
                //     }
                // });
            })
        });
    },
};