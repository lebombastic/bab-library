import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
	console.warn('Supabase env vars are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(
	supabaseUrl || '',
	supabaseAnonKey || ''
);

export type Tables = {
	books: {
		Row: {
			id: string;
			title: string;
			author: string;
			genre: string;
			available: boolean;
			description: string;
			cover_image: string;
		};
		Insert: Omit<Tables['books']['Row'], 'id'> & { id?: string };
		Update: Partial<Tables['books']['Row']>;
	};
	events: {
		Row: {
			id: string;
			title: string;
			date: string;
			time: string;
			description: string;
			whatsapp_group: string;
		};
		Insert: Omit<Tables['events']['Row'], 'id'> & { id?: string };
		Update: Partial<Tables['events']['Row']>;
	};
	event_templates: {
		Row: {
			id: string;
			title: string;
			default_time: string;
			description: string;
			whatsapp_group: string;
			category: string;
		};
		Insert: Omit<Tables['event_templates']['Row'], 'id'> & { id?: string };
		Update: Partial<Tables['event_templates']['Row']>;
	};
	settings: {
		Row: { key: string; value: string };
		Insert: Tables['settings']['Row'];
		Update: Partial<Tables['settings']['Row']>;
	};
};


