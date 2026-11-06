import { Link } from 'react-router-dom';

function Logo({ onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="focus-ring rounded-control font-logo text-2xl leading-none"
    >
      <span className="text-accent">Nova</span>
      <span className="text-white">Market</span>
    </Link>
  );
}

export default Logo;
