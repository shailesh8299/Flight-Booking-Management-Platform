"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Tag } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
;
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Discount } from '@/lib/types';

const AdminDiscounts = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Discount | null>(null);
  const [formData, setFormData] = useState({
    discount_type: 'student' as any,
    discount_percentage: 10,
    description: '',
    required_document: '',
    is_active: true,
  });
  const [saving, setSaving] = useState(false);

  const fetchDiscounts = async () => {
    try {
      const response = await fetch('/api/discounts');
      if (response.ok) {
        const data = await response.json();
        setDiscounts(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDiscounts(); }, []);

  const handleAdd = () => {
    setEditing(null);
    setFormData({ discount_type: 'student', discount_percentage: 10, description: '', required_document: '', is_active: true });
    setDialogOpen(true);
  };

  const handleEdit = (d: Discount) => {
    setEditing(d);
    setFormData({
      discount_type: d.discount_type,
      discount_percentage: d.discount_percentage,
      description: d.description || '',
      required_document: d.required_document || '',
      is_active: d.is_active ?? true,
    });
    setDialogOpen(true);
  };

  const handleToggleActive = async (d: Discount) => {
    try {
      const response = await fetch(`/api/discounts/${d.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !d.is_active })
      });
      if (response.ok) {
        fetchDiscounts();
      }
    } catch (e) {
      toast.error('Failed to update');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      discount_type: formData.discount_type,
      discount_percentage: Number(formData.discount_percentage),
      description: formData.description || null,
      required_document: formData.required_document || null,
      is_active: formData.is_active,
    };

    try {
      const method = editing?.id ? 'PUT' : 'POST';
      const url = editing?.id ? `/api/discounts/${editing.id}` : '/api/discounts';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success(editing ? 'Discount updated' : 'Discount added');
        setDialogOpen(false);
        fetchDiscounts();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to save discount');
      }
    } catch (e: any) {
      toast.error(e.message || 'Failed to save discount');
    }
    setSaving(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Discounts</h1>
            <p className="text-muted-foreground">Manage discount categories for passengers</p>
          </div>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="w-4 h-4" /> Add Discount
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <div key={i} className="bg-card rounded-2xl p-6 animate-pulse h-40" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {discounts.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-card rounded-2xl p-6 shadow-soft border-2 transition-colors ${d.is_active ? 'border-primary/20' : 'border-border opacity-60'
                  }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Tag className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground capitalize">{d.discount_type.replace('_', ' ')}</h3>
                      <p className="text-2xl font-bold text-primary">{d.discount_percentage}% off</p>
                    </div>
                  </div>
                  <Switch checked={d.is_active ?? false} onCheckedChange={() => handleToggleActive(d)} />
                </div>
                {d.description && <p className="text-sm text-muted-foreground mb-3">{d.description}</p>}
                {d.required_document && (
                  <p className="text-xs text-muted-foreground">Required: {d.required_document}</p>
                )}
                <Button variant="ghost" size="sm" className="mt-3 gap-1" onClick={() => handleEdit(d)}>
                  <Pencil className="w-3 h-3" /> Edit
                </Button>
              </motion.div>
            ))}
            {discounts.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No discount configurations yet
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Discount' : 'Add New Discount'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label>Category</Label>
              <Select value={formData.discount_type} onValueChange={(v) => setFormData({ ...formData, discount_type: v as any })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="army">Army</SelectItem>
                  <SelectItem value="senior_citizen">Senior Citizen</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Discount Percentage</Label>
              <Input type="number" min={0} max={100} value={formData.discount_percentage} onChange={(e) => setFormData({ ...formData, discount_percentage: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the discount..." />
            </div>
            <div>
              <Label>Required Document</Label>
              <Input value={formData.required_document} onChange={(e) => setFormData({ ...formData, required_document: e.target.value })} placeholder="e.g. Military ID Card" />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={formData.is_active} onCheckedChange={(v) => setFormData({ ...formData, is_active: v })} />
              <Label>Active</Label>
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? 'Saving...' : editing ? 'Update Discount' : 'Add Discount'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminDiscounts;
