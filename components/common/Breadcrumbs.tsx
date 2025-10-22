import React from 'react';
import { ChevronRightIcon } from '../icons/ChevronRightIcon';

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={item.name}>
            <div className="flex items-center">
              {index > 0 && <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" />}
              <a
                href={item.href || '#'}
                className={`ml-2 text-sm font-medium ${item.href ? 'text-gray-500 hover:text-gray-700' : 'text-gray-400 cursor-default'}`}
                aria-current={index === items.length - 1 ? 'page' : undefined}
              >
                {item.name}
              </a>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};
