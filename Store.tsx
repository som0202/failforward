
import React from 'react';
import { STORE_ITEMS, UserProfile } from '../types';
import { ShoppingBag, Coins } from 'lucide-react';

interface Props {
  user: UserProfile;
  onPurchase: (price: number, itemId: string) => void;
}

export const Store: React.FC<Props> = ({ user, onPurchase }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 rounded-3xl flex justify-between items-center shadow-lg shadow-amber-900/20">
        <div>
          <p className="text-amber-100 text-sm font-medium">보유 포인트</p>
          <h3 className="text-3xl font-black flex items-center gap-2">
            <Coins size={28} /> {user.points.toLocaleString()} P
          </h3>
        </div>
        <ShoppingBag size={48} className="text-amber-200/30" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {STORE_ITEMS.map(item => (
          <div key={item.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between hover:border-amber-500/50 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center text-3xl shadow-inner">
                {item.image}
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase">{item.brand}</p>
                <h4 className="font-bold text-slate-200">{item.name}</h4>
                <p className="text-amber-500 font-bold text-sm">{item.price.toLocaleString()} P</p>
              </div>
            </div>
            <button
              onClick={() => onPurchase(item.price, item.id)}
              disabled={user.points < item.price}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                user.points >= item.price 
                ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              구매하기
            </button>
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl text-xs text-slate-500 leading-relaxed italic">
        * 구매한 기프티콘은 마이페이지 보관함으로 즉시 발송됩니다. (체험판에서는 포인트 소진만 확인 가능)
      </div>
    </div>
  );
};
