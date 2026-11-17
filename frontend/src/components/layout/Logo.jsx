import { Link } from 'react-router-dom';
import logo from '../../assets/logo-novamarket.png';

function Logo({ onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="focus-ring flex w-fit rounded-control"
    >
      <img
        src={logo}
        alt="NovaMarket"
        width={632}
        height={104}
        className="h-6 w-auto sm:h-8"
      />
    </Link>
  );
}

export default Logo;
