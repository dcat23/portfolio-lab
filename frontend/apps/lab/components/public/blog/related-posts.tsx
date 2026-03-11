'use client';

import { ReactNode } from 'react';

interface Props {
  data?: unknown;
  children?: ReactNode;
}

export function RelatedPosts(props: Props) {
  return (
    <>
      RelatedPosts
      {props.children}
    </>
  );
}

export default RelatedPosts;
