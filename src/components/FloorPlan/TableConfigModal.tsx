import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Circle, Square, Trash2 } from 'lucide-react';
import { Table } from './types';

interface TableConfigModalProps {
  table: Table | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (table: Table) => void;
  onDelete: (tableId: string) => void;
}

export const TableConfigModal: React.FC<TableConfigModalProps> = ({
  table,
  isOpen,
  onClose,
  onSave,
  onDelete
}) => {
  const [formData, setFormData] = useState<Partial<Table>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (table) {
      setFormData({ ...table });
    } else {
      setFormData({});
    }
    setErrors({});
  }, [table]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.capacity?.min || formData.capacity.min < 1) {
      newErrors.minCapacity = 'La capacidad mínima debe ser mayor a 0';
    }

    if (!formData.capacity?.max || formData.capacity.max < 1) {
      newErrors.maxCapacity = 'La capacidad máxima debe ser mayor a 0';
    }

    if (formData.capacity?.min && formData.capacity?.max && formData.capacity.min > formData.capacity.max) {
      newErrors.capacity = 'La capacidad mínima no puede ser mayor a la máxima';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm() || !formData.id) return;

    onSave(formData as Table);
    onClose();
  };

  const handleDelete = () => {
    if (!table?.id) return;
    
    if (confirm('¿Estás seguro de que quieres eliminar esta mesa?')) {
      onDelete(table.id);
      onClose();
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!table) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {formData.shape === 'circular' ? (
              <Circle className="h-5 w-5 text-primary" />
            ) : (
              <Square className="h-5 w-5 text-primary" />
            )}
            Configurar Mesa
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Table Name */}
          <div className="space-y-2">
            <Label htmlFor="table-name">Nombre de la Mesa</Label>
            <Input
              id="table-name"
              value={formData.name || ''}
              onChange={(e) => updateFormData('name', e.target.value)}
              placeholder="Ej: Mesa 12"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Table Shape */}
          <div className="space-y-2">
            <Label>Forma de la Mesa</Label>
            <Select
              value={formData.shape}
              onValueChange={(value) => updateFormData('shape', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="circular">
                  <div className="flex items-center gap-2">
                    <Circle className="h-4 w-4" />
                    Mesa Circular
                  </div>
                </SelectItem>
                <SelectItem value="rectangular">
                  <div className="flex items-center gap-2">
                    <Square className="h-4 w-4" />
                    Mesa Rectangular
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Capacity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min-capacity">Capacidad Mínima</Label>
              <Input
                id="min-capacity"
                type="number"
                min="1"
                value={formData.capacity?.min || ''}
                onChange={(e) => updateFormData('capacity', {
                  ...formData.capacity,
                  min: parseInt(e.target.value) || 0
                })}
                className={errors.minCapacity ? 'border-destructive' : ''}
              />
              {errors.minCapacity && (
                <p className="text-sm text-destructive">{errors.minCapacity}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-capacity">Capacidad Máxima</Label>
              <Input
                id="max-capacity"
                type="number"
                min="1"
                value={formData.capacity?.max || ''}
                onChange={(e) => updateFormData('capacity', {
                  ...formData.capacity,
                  max: parseInt(e.target.value) || 0
                })}
                className={errors.maxCapacity ? 'border-destructive' : ''}
              />
              {errors.maxCapacity && (
                <p className="text-sm text-destructive">{errors.maxCapacity}</p>
              )}
            </div>
          </div>

          {errors.capacity && (
            <p className="text-sm text-destructive">{errors.capacity}</p>
          )}

          {/* Status */}
          <div className="space-y-2">
            <Label>Estado</Label>
            <div className="flex gap-2">
              <Badge 
                variant={formData.status === 'active' ? 'default' : 'secondary'}
                className="cursor-pointer"
                onClick={() => updateFormData('status', 'active')}
              >
                Activa
              </Badge>
              <Badge 
                variant={formData.status === 'excluded' ? 'default' : 'secondary'}
                className="cursor-pointer"
                onClick={() => updateFormData('status', 'excluded')}
              >
                Excluida
              </Badge>
            </div>
          </div>

          {/* Dining Area */}
          <div className="space-y-2">
            <Label>Área de Comedor</Label>
            <Select
              value={formData.diningArea}
              onValueChange={(value) => updateFormData('diningArea', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="interior">Interior</SelectItem>
                <SelectItem value="exterior">Exterior/Terraza</SelectItem>
                <SelectItem value="vip">Área VIP</SelectItem>
                <SelectItem value="bar">Barra/Bar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="mr-auto"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-gradient-primary">
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};