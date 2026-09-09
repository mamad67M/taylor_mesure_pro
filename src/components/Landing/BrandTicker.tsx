import React from 'react';

export const BrandTicker: React.FC = () => {
  const items = [
    { text: "NOUVELLE ÈRE DE LA HAUTE COUTURE OUEST-AFRICAINE", icon: "✦", color: "" },
    { dot: true, color: "bg-gold-sand" },
    { text: "Warm Ivory", dotColor: "bg-[#FBF8F3]" },
    { text: "Terracotta Doux", dotColor: "bg-terracotta" },
    { text: "Deep Green", dotColor: "bg-[#1B3528]" },
    { text: "Pagne Tissé & Kente", dotColor: "bg-[#D1A358]" },
    { text: "Wax Authentique & Bazin", dotColor: "bg-[#D97706]" }
  ];

  return (
    <aside className="bg-deep-green text-linen py-2 border-y border-deep-green-dark overflow-hidden select-none">
      <div className="ticker-track text-[11px] uppercase tracking-[0.22em] font-medium flex items-center space-x-6">
        {[...Array(2)].map((_, i) => (
          <React.Fragment key={i}>
            {items.map((item, index) => (
              item.dot ? (
                <span key={index} className={`w-1.5 h-1.5 rounded-full ${item.color} inline-block`}></span>
              ) : (
                <span key={index} className="inline-flex items-center gap-2">
                  {item.icon ? <span>{item.icon}</span> : <span className={`w-2 h-2 rounded-full ${item.dotColor}`}></span>}
                  {item.text}
                </span>
              )
            ))}
          </React.Fragment>
        ))}
      </div>
    </aside>
  );
};