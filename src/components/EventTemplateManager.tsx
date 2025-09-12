import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Plus, FileText, Trash2, Copy } from "lucide-react";

export interface EventTemplate {
  id: string;
  title: string;
  defaultTime: string;
  description: string;
  whatsappGroup: string;
  category: string;
}

interface EventTemplateManagerProps {
  templates: EventTemplate[];
  onAddTemplate: (template: Omit<EventTemplate, 'id'>) => void;
  onRemoveTemplate: (templateId: string) => void;
  onCreateEventFromTemplate: (template: EventTemplate, date: string) => void;
}

export function EventTemplateManager({ 
  templates, 
  onAddTemplate, 
  onRemoveTemplate, 
  onCreateEventFromTemplate 
}: EventTemplateManagerProps) {
  const [isAddingTemplate, setIsAddingTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EventTemplate | null>(null);
  const [eventDate, setEventDate] = useState("");

  const [templateFormData, setTemplateFormData] = useState({
    title: "",
    defaultTime: "",
    description: "",
    whatsappGroup: "",
    category: ""
  });

  const handleAddTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!templateFormData.title || !templateFormData.defaultTime || !templateFormData.description) {
      return;
    }

    onAddTemplate({
      ...templateFormData,
      whatsappGroup: templateFormData.whatsappGroup || "https://chat.whatsapp.com/default-group"
    });

    // Reset form
    setTemplateFormData({
      title: "",
      defaultTime: "",
      description: "",
      whatsappGroup: "",
      category: ""
    });
    
    setIsAddingTemplate(false);
  };

  const handleCreateFromTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTemplate || !eventDate) {
      return;
    }

    onCreateEventFromTemplate(selectedTemplate, eventDate);
    setSelectedTemplate(null);
    setEventDate("");
  };

  if (isAddingTemplate) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Create Event Template</h4>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsAddingTemplate(false)}
          >
            Cancel
          </Button>
        </div>
        
        <form onSubmit={handleAddTemplate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="template-title">Template Title*</Label>
              <Input
                id="template-title"
                value={templateFormData.title}
                onChange={(e) => setTemplateFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Silent Reading Session"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="template-category">Category</Label>
              <Input
                id="template-category"
                value={templateFormData.category}
                onChange={(e) => setTemplateFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="e.g., Reading, Discussion, Workshop"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="template-time">Default Time*</Label>
            <Input
              id="template-time"
              value={templateFormData.defaultTime}
              onChange={(e) => setTemplateFormData(prev => ({ ...prev, defaultTime: e.target.value }))}
              placeholder="e.g., 6:00 PM - 8:00 PM"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="template-description">Description*</Label>
            <Textarea
              id="template-description"
              value={templateFormData.description}
              onChange={(e) => setTemplateFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Template description that can be reused"
              rows={3}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="template-whatsapp">WhatsApp Group Link</Label>
            <Input
              id="template-whatsapp"
              type="url"
              value={templateFormData.whatsappGroup}
              onChange={(e) => setTemplateFormData(prev => ({ ...prev, whatsappGroup: e.target.value }))}
              placeholder="https://chat.whatsapp.com/your-group-link"
            />
          </div>
          
          <Button type="submit" className="w-full">
            Create Template
          </Button>
        </form>
      </div>
    );
  }

  if (selectedTemplate) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Create Event from Template</h4>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSelectedTemplate(null)}
          >
            Cancel
          </Button>
        </div>
        
        <div className="p-3 border rounded-lg bg-muted/50">
          <h5 className="font-medium">{selectedTemplate.title}</h5>
          <p className="text-sm text-muted-foreground mt-1">{selectedTemplate.description}</p>
          <p className="text-xs text-muted-foreground mt-2">Time: {selectedTemplate.defaultTime}</p>
        </div>
        
        <form onSubmit={handleCreateFromTemplate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="event-date">Event Date*</Label>
            <Input
              id="event-date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              placeholder="e.g., Friday, September 20th, 2025"
              required
            />
          </div>
          
          <Button type="submit" className="w-full">
            Create Event
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          <h3 className="font-medium">Event Templates</h3>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsAddingTemplate(true)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Template
        </Button>
      </div>
      
      <div className="max-h-80 overflow-y-auto space-y-3">
        {templates.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No event templates created yet
          </p>
        ) : (
          templates.map((template) => (
            <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium truncate">{template.title}</h4>
                  {template.category && (
                    <Badge variant="outline" className="text-xs">
                      {template.category}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {template.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {template.defaultTime}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTemplate(template)}
                  className="gap-1"
                >
                  <Copy className="w-3 h-3" />
                  Use
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemoveTemplate(template.id)}
                  className="text-destructive hover:text-destructive gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}