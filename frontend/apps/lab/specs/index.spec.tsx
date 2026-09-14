import React from 'react';
import { render } from '@testing-library/react';
import Page from '../app/page';

describe('Page', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Page params={} />);
    expect(baseElement).toBeTruthy();
  });
});
