
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';
import { useAuth } from '@/components/auth/AuthProvider';

type Segment = Tables<'segments'>;
type SegmentInsert = TablesInsert<'segments'>;

export const useSegments = () => {
  return useQuery({
    queryKey: ['segments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('segments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Segment[];
    }
  });
};

export const useCreateSegment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (segment: Omit<SegmentInsert, 'user_id'>) => {
      if (!user) throw new Error('User must be authenticated');
      
      const { data, error } = await supabase
        .from('segments')
        .insert({ ...segment, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['segments'] });
    }
  });
};

export const useGetMatchingCustomers = () => {
  return useMutation({
    mutationFn: async (rules: any[]) => {
      const { data, error } = await supabase
        .rpc('get_matching_customers', { p_segment_rules: rules });
      
      if (error) throw error;
      return data;
    }
  });
};
