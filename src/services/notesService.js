import { supabase } from '../lib/supabaseClient';

const TABLE = 'notes';

export const getNotes = async (userId) => {
    if (!userId) {
        console.warn("❌ No user ID provided to getNotes");
        return [];
    }

    console.log("🔍 Fetching notes for user:", userId);

    try {
        const { data, error } = await supabase
            .from(TABLE)
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        console.log("✅ Notes fetched:", data.length);
        return data;
    } catch (err) {
        console.error("❌ Get notes error:", err);
        throw new Error(err.message || 'Failed to load notes');
    }
};

export const createNote = async (noteData, userId) => {
    console.log("📝 Creating note for user:", userId);
    console.log("📝 Note data:", noteData);

    if (!userId) throw new Error("User ID required for creating note");

    try {
        const { data, error } = await supabase
            .from(TABLE)
            .insert([{ ...noteData, user_id: userId }])
            .select()
            .single();
        if (error) throw error;
        console.log("✅ Note created:", data);
        return data;
    } catch (err) {
        console.error("❌ Create note error:", err);
        throw new Error(err.message || 'Failed to create note');
    }
};

export const updateNote = async (id, updates) => {
    const { data, error } = await supabase
        .from(TABLE)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data;
};

export const deleteNote = async (id) => {
    const { error } = await supabase.from(TABLE).delete().eq('id', id);
    if (error) throw error;
};
