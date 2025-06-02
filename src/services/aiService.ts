
// AI Service for Natural Language Processing and Message Generation
export class AIService {
  // Simulate AI-powered natural language to rules conversion
  static async parseNaturalLanguageToRules(input: string) {
    // In production, this would call a real AI API like OpenAI GPT-4
    const mockDelay = () => new Promise(resolve => setTimeout(resolve, 1500));
    await mockDelay();
    
    const rules = [];
    const lowercaseInput = input.toLowerCase();
    
    // Parse spending patterns
    const spendMatch = lowercaseInput.match(/spend.*?(\d+)/i) || lowercaseInput.match(/spent.*?(\d+)/i);
    if (spendMatch) {
      rules.push({
        id: Date.now().toString(),
        field: 'totalSpent',
        operator: lowercaseInput.includes('over') || lowercaseInput.includes('>') ? '>' : '<',
        value: spendMatch[1]
      });
    }
    
    // Parse time-based patterns
    const timeMatch = lowercaseInput.match(/(\d+)\s*(months?|days?)/i);
    if (timeMatch && (lowercaseInput.includes('inactive') || lowercaseInput.includes('haven\'t'))) {
      const days = timeMatch[2].toLowerCase().includes('month') ? parseInt(timeMatch[1]) * 30 : parseInt(timeMatch[1]);
      rules.push({
        id: (Date.now() + 1).toString(),
        field: 'lastPurchase',
        operator: '>',
        value: days.toString(),
        logicalOperator: 'AND'
      });
    }
    
    // Parse order frequency
    const orderMatch = lowercaseInput.match(/(\d+)\s*(orders?|purchases?)/i);
    if (orderMatch) {
      rules.push({
        id: (Date.now() + 2).toString(),
        field: 'totalOrders',
        operator: lowercaseInput.includes('less') || lowercaseInput.includes('<') ? '<' : '>',
        value: orderMatch[1],
        logicalOperator: 'AND'
      });
    }
    
    return rules.length > 0 ? rules : [{
      id: Date.now().toString(),
      field: 'totalSpent',
      operator: '>',
      value: '1000'
    }];
  }
  
  // Generate AI-powered marketing messages
  static async generateMessages(objective: string, audienceType: string) {
    const mockDelay = () => new Promise(resolve => setTimeout(resolve, 2000));
    await mockDelay();
    
    const messageTemplates = {
      'bring back inactive users': [
        'Hi {{name}}, we miss you! Get 20% off your next order and rediscover what you love. Shop now!',
        '{{name}}, your favorites are waiting! Enjoy exclusive 20% savings on your next purchase. Limited time offer!',
        'Hello {{name}}! Come back and save big with 20% off. Plus, free shipping on orders over ₹1,000!'
      ],
      'increase repeat purchases': [
        'Thanks for your recent purchase {{name}}! Get 15% off your next order when you shop again within 30 days.',
        '{{name}}, loved your last order? Complete your collection with 15% off today!',
        'Hi {{name}}, based on your recent purchase, we think you\'ll love these items. 15% off inside!'
      ],
      'promote new products': [
        '{{name}}, be the first to discover our latest collection! Exclusive early access with 25% off.',
        'New arrivals just for you {{name}}! Get 25% off our newest products before anyone else.',
        'Hi {{name}}, exciting news! New products are here with exclusive 25% savings for valued customers like you.'
      ],
      'reward loyal customers': [
        'Thank you for being amazing {{name}}! Enjoy VIP perks and exclusive 30% off as our way of saying thanks.',
        '{{name}}, your loyalty means everything! Here\'s 30% off plus exclusive access to member-only deals.',
        'Hi {{name}}, you\'re part of our VIP family! Enjoy special rewards and 30% off your next purchase.'
      ]
    };
    
    const objective_key = objective.toLowerCase();
    return messageTemplates[objective_key] || messageTemplates['promote new products'];
  }
  
  // Generate campaign performance insights
  static generateCampaignInsights(campaigns: any[]) {
    const insights = [];
    
    // Delivery rate analysis
    const avgDeliveryRate = campaigns.reduce((sum, c) => sum + parseFloat(c.deliveryRate), 0) / campaigns.length;
    if (avgDeliveryRate > 95) {
      insights.push('Excellent delivery rates! Your campaigns are reaching customers effectively.');
    } else if (avgDeliveryRate > 90) {
      insights.push('Good delivery rates. Consider optimizing send times for even better performance.');
    } else {
      insights.push('Delivery rates could be improved. Review your audience quality and message content.');
    }
    
    // Audience performance
    const vipCampaigns = campaigns.filter(c => c.audience.includes('VIP'));
    if (vipCampaigns.length > 0) {
      const vipAvgDelivery = vipCampaigns.reduce((sum, c) => sum + parseFloat(c.deliveryRate), 0) / vipCampaigns.length;
      insights.push(`VIP customer campaigns achieve ${vipAvgDelivery.toFixed(1)}% delivery rate on average.`);
    }
    
    // Time-based recommendations
    insights.push('Recommended: Schedule campaigns on Tuesday-Thursday for optimal engagement.');
    insights.push('Consider A/B testing message length - shorter messages often perform better.');
    
    return insights;
  }
}
