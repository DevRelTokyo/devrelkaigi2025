import { Link } from "@remix-run/react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          {items.map((item, index) => (
            <li className="breadcrumb-item" key={index}>
              {item.href ? <Link to={item.href}>{item.label}</Link> : item.label}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}