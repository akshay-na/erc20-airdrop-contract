export default function TxList({ txs }) {
  if (txs.length === 0) return null;
  return (
    <>
      {txs.map((item) => (
        <div key={item.txHash} className="alert-info mt-5 rounded-xl py-2 px-4">
          <div>
            <p>From: {item.from}</p>
            <p>To: {item.to}</p>
            <p>Amount: {item.amount}</p>
            <a href={`https://rinkeby.etherscan.io/tx/${item.txHash}`}>
              Check in block explorer
            </a>
          </div>
        </div>
      ))}
    </>
  );
}
