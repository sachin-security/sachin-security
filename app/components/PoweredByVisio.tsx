import Image from 'next/image';

export default function PoweredByVisio() {
  return <div className="visio-credit"><a href="https://www.visioitsolutions.com" target="_blank" rel="noopener noreferrer" aria-label="Powered by VISIO IT SOLUTIONS — opens in a new tab"><Image src="/visio-it-logo.png" alt="VISIO IT SOLUTIONS logo" width={48} height={48} /><span>Powered by <strong>VISIO IT SOLUTIONS</strong></span></a></div>;
}
