import { useEffect } from 'react';

export default function VLibras() {
  useEffect(() => {
    if (window.VLibras) {
      new window.VLibras.Widget('https://vlibras.gov.br/app');
    }
  }, []);

  return null;
}
