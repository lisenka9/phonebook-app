import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Contact } from '../models/contact';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  // Получить все контакты
  async getContacts(): Promise<Contact[]> {
    const { data, error } = await this.supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  // Создать новый контакт
  async createContact(contact: Contact): Promise<Contact> {
    const { data, error } = await this.supabase
      .from('contacts')
      .insert([contact])
      .single();
    
    if (error) throw error;
    return data;
  }

  // Обновить контакт
  async updateContact(contact: Contact): Promise<Contact> {
    const { data, error } = await this.supabase
      .from('contacts')
      .update(contact)
      .eq('id', contact.id)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Удалить контакт
  async deleteContact(id: number): Promise<void> {
    const { error } = await this.supabase
      .from('contacts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}