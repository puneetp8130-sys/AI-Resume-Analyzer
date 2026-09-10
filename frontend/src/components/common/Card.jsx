import React from 'react';
import { classNames } from '../../utils/classNames';

export default function Card({ children, className = '', as: Tag = 'div', ...rest }) {
  return (
    <Tag className={classNames('card', className)} {...rest}>
      {children}
    </Tag>
  );
}
