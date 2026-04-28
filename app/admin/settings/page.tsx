"use client"

import { Settings, Shield, Bell, Database, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminSettings() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Paramètres du Système</h2>
        <p className="text-muted-foreground mt-1">Gérez les configurations globales de la plateforme EduSmart SN.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-8 space-y-6 shadow-sm">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Settings className="text-primary" />
              Configuration Générale
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Nom de la Plateforme</label>
                <Input defaultValue="EduSmart SN" className="bg-muted/30" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">URL du Système</label>
                <Input defaultValue="edusmart-sn.vercel.app" className="bg-muted/30" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold">E-mail de Support</label>
                <Input defaultValue="support@edusmart.sn" className="bg-muted/30" />
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <Button className="gap-2 bg-primary">
                <Save size={18} />
                Enregistrer les modifications
              </Button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 space-y-6 shadow-sm">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Bell className="text-amber-500" />
              Notifications & Email
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-border/50">
                <div>
                  <p className="font-bold">Notifications de Démo</p>
                  <p className="text-xs text-muted-foreground">Recevoir un e-mail à chaque nouvelle demande.</p>
                </div>
                <div className="w-12 h-6 bg-primary rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-border/50 opacity-50">
                <div>
                  <p className="font-bold">Rapports Hebdomadaires</p>
                  <p className="text-xs text-muted-foreground">Résumé des performances de toutes les universités.</p>
                </div>
                <div className="w-12 h-6 bg-muted-foreground/30 rounded-full relative">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-8 space-y-4 shadow-sm border-l-4 border-l-primary">
            <div className="flex items-center gap-3 text-primary mb-2">
              <Shield size={24} />
              <h3 className="font-bold uppercase tracking-wider text-xs">Sécurité Système</h3>
            </div>
            <p className="text-sm text-muted-foreground italic">
              "La sécurité est une priorité. Toutes les données sont chiffrées en local sur votre base MySQL."
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 space-y-4 shadow-sm">
            <div className="flex items-center gap-3 text-emerald-600 mb-2">
              <Database size={24} />
              <h3 className="font-bold uppercase tracking-wider text-xs">État de la Base de Données</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Moteur :</span>
                <span className="font-bold">MySQL 8.0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tables actives :</span>
                <span className="font-bold text-emerald-600">10 / 10</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sauvegarde :</span>
                <span className="font-bold text-amber-600">Manuelle</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4 text-xs font-bold uppercase tracking-widest border-emerald-600/20 text-emerald-600 hover:bg-emerald-50">
              Vérifier l'intégrité
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
