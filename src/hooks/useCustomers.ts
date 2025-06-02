
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';
import { useAuth } from '@/components/auth/AuthProvider';

type Customer = Tables<'customers'>;
type CustomerInsert = TablesInsert<'customers'>;

export const useCustomers = () => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Customer[];
    }
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (customer: Omit<CustomerInsert, 'user_id'>) => {
      if (!user) throw new Error('User must be authenticated');
      
      const { data, error } = await supabase
        .from('customers')
        .insert({ ...customer, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    }
  });
};

export const useBulkCreateCustomers = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (customers: Omit<CustomerInsert, 'user_id'>[]) => {
      if (!user) throw new Error('User must be authenticated');
      
      const customersWithUserId = customers.map(customer => ({
        ...customer,
        user_id: user.id
      }));
      
      const { data, error } = await supabase
        .from('customers')
        .insert(customersWithUserId)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    }
  });
};
