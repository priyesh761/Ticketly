import Link from "next/link";

export default ({ currentUser }) => {
  const links = [
    !currentUser && { label: "Sign Up", href: "/auth/signup" },
    !currentUser && { label: "Sign in", href: "/auth/signin" },
    currentUser && { label: "Sign Out", href: "/auth/signout" },
  ]
    .filter(Boolean)
    .map(({ label, href }) => (
      <li key={href}>
        <Link href={href} className="nav0link">
          {label}
        </Link>
      </li>
    ));

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/" className="navbar-brand">
        Tikt.ly
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="d-flex nav align-items-center">{links}</ul>
      </div>
    </nav>
  );
};
