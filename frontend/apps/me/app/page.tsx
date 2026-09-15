import React from 'react';
import { Header } from '../components/header'

interface Props {
  params: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Index(props: Props) {
  return (
    <>
      <Header />
    </>
  );
}
