interface Bank {
  code: string;
  name: string;
  bg: string;
  fg: string;
}

// Brand colours of the Thai banks we accept. Swap `code` for an <img> here
// once the official logo files are available — this is the only place that
// renders a bank mark.
const banks: Bank[] = [
  { code: "SCB", name: "Siam Commercial Bank", bg: "#4E2A84", fg: "#ffffff" },
  { code: "KBank", name: "Kasikornbank", bg: "#138F2D", fg: "#ffffff" },
  { code: "BBL", name: "Bangkok Bank", bg: "#1E4598", fg: "#ffffff" },
  { code: "KTB", name: "Krungthai Bank", bg: "#00A6E3", fg: "#ffffff" },
  { code: "BAY", name: "Krungsri", bg: "#FEC43B", fg: "#3d3d3d" },
  { code: "TTB", name: "TMBThanachart", bg: "#068EE1", fg: "#ffffff" },
];

export const BankLogos = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-1 shrink-0 ${className}`}>
      {banks.map((bank) => (
        <span
          key={bank.code}
          title={bank.name}
          className="inline-flex items-center justify-center h-5 px-1.5 rounded text-[9px] font-bold tracking-tight leading-none"
          style={{ backgroundColor: bank.bg, color: bank.fg }}
        >
          {bank.code}
        </span>
      ))}
    </div>
  );
};
