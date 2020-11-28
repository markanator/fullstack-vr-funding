import { Box } from '@chakra-ui/react';
import React from 'react'

export default function Wrapper({children, variant="regular"}) {
  return (
    <Box
      mt={8}
      mx='auto'
      maxW={variant = "regular" ? "960px": "400px"}
      w="100%"
    >
      {children}
    </Box>
  )
}
