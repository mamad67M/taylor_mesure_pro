import React from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Commande, Client, StatutCommande, AtelierSettings } from '../types';
import { formatCurrency, getDeliveryRelativeText } from '../utils/format';
import { Calendar, User, ChevronRight } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface KanbanBoardProps {
  commandes: Commande[];
  clientMap: Map<string, Client>;
  settings: AtelierSettings;
  onSelectCommande: (id: string) => void;
  onSelectClient: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: StatutCommande) => void;
}

const COLUMNS: { id: StatutCommande; title: string; color: string; bgColor: string }[] = [
  { id: 'en_cours', title: 'En cours', color: 'text-[#D4A017]', bgColor: 'bg-[#D4A017]/10' },
  { id: 'pret', title: 'Prêt à livrer', color: 'text-[#3A7CA6]', bgColor: 'bg-[#3A7CA6]/10' },
  { id: 'solde', title: 'Soldées', color: 'text-[#1F4D3A]', bgColor: 'bg-[#1F4D3A]/10' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  commandes,
  clientMap,
  settings,
  onSelectCommande,
  onSelectClient,
  onUpdateStatus
}) => {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    
    if (!over) return;
    
    const commandeId = active.id as string;
    const newStatus = over.id as StatutCommande;
    
    const commande = commandes.find(c => c.id === commandeId);
    if (commande && commande.statut !== newStatus) {
      onUpdateStatus(commandeId, newStatus);
    }
  };

  const activeCommande = activeId ? commandes.find(c => c.id === activeId) : null;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
        {COLUMNS.map(col => {
          const columnCommandes = commandes.filter(c => c.statut === col.id);
          return (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.title}
              color={col.color}
              bgColor={col.bgColor}
              commandes={columnCommandes}
              clientMap={clientMap}
              settings={settings}
              onSelectCommande={onSelectCommande}
              onSelectClient={onSelectClient}
            />
          );
        })}
      </div>
      
      <DragOverlay dropAnimation={null}>
        {activeCommande ? (
          <KanbanCard
            commande={activeCommande}
            client={clientMap.get(activeCommande.client_id)}
            settings={settings}
            isOverlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

interface KanbanColumnProps {
  id: StatutCommande;
  title: string;
  color: string;
  bgColor: string;
  commandes: Commande[];
  clientMap: Map<string, Client>;
  settings: AtelierSettings;
  onSelectCommande: (id: string) => void;
  onSelectClient: (id: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id, title, color, bgColor, commandes, clientMap, settings, onSelectCommande, onSelectClient
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex-1 min-w-[280px] max-w-[350px] snap-center shrink-0 flex flex-col gap-3">
      <div className={`flex items-center justify-between px-4 py-3 rounded-2xl ${bgColor}`}>
        <h3 className={`font-bold text-sm ${color}`}>{title}</h3>
        <span className={`text-xs font-bold ${color} opacity-70`}>{commandes.length}</span>
      </div>
      
      <div 
        ref={setNodeRef}
        className={`flex-1 flex flex-col gap-3 min-h-[500px] rounded-2xl p-2 transition-colors ${
          isOver ? 'bg-[#0D1B2A]/5 border-2 border-dashed border-[#0D1B2A]/20' : 'bg-transparent'
        }`}
      >
        {commandes.map(cmd => (
          <DraggableKanbanCard
            key={cmd.id}
            commande={cmd}
            client={clientMap.get(cmd.client_id)}
            settings={settings}
            onSelectCommande={() => onSelectCommande(cmd.id)}
            onSelectClient={() => onSelectClient(cmd.client_id)}
          />
        ))}
      </div>
    </div>
  );
};

interface KanbanCardProps {
  commande: Commande;
  client?: Client;
  settings: AtelierSettings;
  onSelectCommande?: () => void;
  onSelectClient?: () => void;
  isOverlay?: boolean;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ commande, client, settings, onSelectCommande, onSelectClient, isOverlay }) => {
  const relativeDate = getDeliveryRelativeText(commande.date_livraison);
  
  return (
    <div 
      onClick={onSelectCommande}
      className={`bg-white rounded-2xl p-4 border border-[#0D1B2A]/8 shadow-xs cursor-pointer flex flex-col gap-3 group
        ${isOverlay ? 'rotate-3 scale-105 shadow-xl ring-2 ring-[#D4A017]' : 'hover:border-[#D4A017]/60 active:scale-99 transition'}
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <User size={14} className="text-[#D4A017] shrink-0" />
          <span className="font-display font-bold text-sm text-[#0D1B2A] truncate">
            {client ? `${client.prenom} ${client.nom}` : 'Client inconnu'}
          </span>
        </div>
        <span className="text-[9px] font-mono bg-[#0D1B2A]/5 px-2 py-0.5 rounded-full text-[#0D1B2A]/50 shrink-0">
          {commande.reference}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#0D1B2A]/5 shrink-0 border border-[#0D1B2A]/10">
          {commande.image_tissu ? (
            <img src={commande.image_tissu} alt="Tissu" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] text-[#0D1B2A]/30">Tissu</div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-[#0D1B2A]/85 truncate">{commande.nom_tissu || 'Sans nom'}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
              relativeDate.isLate ? 'bg-[#A63A3A]/15 text-[#A63A3A]' : 
              relativeDate.isUrgent ? 'bg-[#D4A017]/20 text-[#9A7000]' : 'bg-[#0D1B2A]/5 text-[#0D1B2A]/70'
            }`}>
              <Calendar size={10} /> {relativeDate.label}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between pt-2 border-t border-gray-100">
        <div>
          <span className="text-[9px] uppercase tracking-wider text-[#0D1B2A]/50 block">Reste à payer</span>
          <span className={`text-sm font-display font-bold ${commande.reste_a_payer > 0 ? 'text-[#0D1B2A]' : 'text-[#1F4D3A]'}`}>
            {formatCurrency(commande.reste_a_payer, settings.devise)}
          </span>
        </div>
        <StatusBadge statut={commande.statut} size="sm" />
      </div>
    </div>
  );
};

const DraggableKanbanCard: React.FC<KanbanCardProps> = (props) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: props.commande.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <KanbanCard {...props} />
    </div>
  );
};
