import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaChevronRight, FaHome } from "react-icons/fa";

function Breadcrumbs({ items = [] }) {
  const location = useLocation();

  let breadcrumbItems = items;

  if (breadcrumbItems.length === 0) {
    const segments = location.pathname
      .split("/")
      .filter(Boolean);

    if (segments.length === 0) {
      return null;
    }

    breadcrumbItems = segments.map((segment, index) => {
      const path =
        "/" + segments.slice(0, index + 1).join("/");

      const label = segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (letter) =>
          letter.toUpperCase()
        );

      return {
        label,
        path,
      };
    });
  }

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link
        to="/"
        className="breadcrumb-home"
        aria-label="Home"
      >
        <FaHome />
      </Link>

      {breadcrumbItems.map((item, index) => {
        const isLast =
          index === breadcrumbItems.length - 1;

        return (
          <React.Fragment key={`${item.label}-${index}`}>
            <FaChevronRight className="breadcrumb-separator" />

            {isLast ? (
              <span
                className="breadcrumb-current"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                className="breadcrumb-link"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export default Breadcrumbs;
