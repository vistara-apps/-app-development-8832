/**
 * Fashion AI prompts for Study & Style application
 * Contains all prompts used for OpenAI API interactions
 */

export const fashionPrompts = {
  // System prompt that defines the AI's role and behavior
  systemPrompt: `You are a professional fashion stylist and wardrobe consultant specializing in student fashion. You have expertise in:

- Creating stylish, budget-friendly outfits for college students
- Understanding current fashion trends and timeless classics
- Providing practical advice for different occasions (classes, parties, interviews, casual outings)
- Analyzing wardrobes and identifying gaps or optimization opportunities
- Recommending sustainable and cost-effective fashion choices
- Understanding the unique needs of student lifestyles (comfort, versatility, affordability)

Your responses should be:
- Practical and actionable
- Budget-conscious and student-friendly
- Trend-aware but not trend-dependent
- Inclusive and body-positive
- Focused on versatility and mix-and-match potential
- Always formatted as valid JSON

Remember that your audience consists of students who value both style and practicality, often with limited budgets but high aspirations for looking great.`,

  // Outfit recommendation prompt
  outfitRecommendation: (context) => `
Please create outfit recommendations based on the following context:

**Occasion**: ${context.occasion}
**Style Preference**: ${context.style}
**Budget Range**: ${context.budget}
**Weather**: ${context.weather}
**Preferred Colors**: ${context.colors.join(', ') || 'No specific preference'}

**Current Wardrobe Items**:
${context.wardrobeItems.length > 0 
  ? context.wardrobeItems.map(item => 
      `- ${item.name} (${item.category}, ${item.color}, worn ${item.wearCount} times)`
    ).join('\n')
  : 'No wardrobe items provided'
}

Please provide 3-5 outfit recommendations that:
1. Are appropriate for the specified occasion and weather
2. Match the user's style preferences
3. Incorporate existing wardrobe items when possible
4. Suggest affordable alternatives for missing pieces
5. Include styling tips and reasoning

Format your response as JSON with this structure:
{
  "recommendations": [
    {
      "id": "unique_id",
      "title": "Outfit Name",
      "description": "Brief description",
      "items": ["item1", "item2", "item3"],
      "existingItems": ["items from wardrobe"],
      "newItems": ["items to purchase"],
      "estimatedCost": "$XX",
      "confidence": 0.9,
      "occasion": "specific occasion",
      "styleNotes": "styling tips"
    }
  ],
  "reasoning": "Overall reasoning for these recommendations",
  "confidence": 0.85,
  "alternatives": ["alternative styling suggestions"],
  "tips": ["general styling tips for this occasion/style"]
}`,

  // Wardrobe analysis prompt
  wardrobeAnalysis: (context) => `
Please analyze the following wardrobe and provide insights:

**Total Items**: ${context.totalItems}

**Category Breakdown**:
${Object.entries(context.categories).map(([category, count]) => 
  `- ${category}: ${count} items`
).join('\n')}

**Color Distribution**:
${Object.entries(context.colors).map(([color, count]) => 
  `- ${color}: ${count} items`
).join('\n')}

**Brand Distribution**:
${Object.entries(context.brands).map(([brand, count]) => 
  `- ${brand}: ${count} items`
).join('\n')}

**Wear Patterns**:
- Most worn items: ${context.wearPatterns.mostWorn.map(item => item.name).join(', ')}
- Least worn items: ${context.wearPatterns.leastWorn.length} items
- Recently worn: ${context.wearPatterns.recentlyWorn.length} items

**Individual Items**:
${context.items.map(item => 
  `- ${item.name} (${item.category}, ${item.color}, ${item.brand}, worn ${item.wearCount} times, condition: ${item.condition})`
).join('\n')}

Please provide a comprehensive analysis including:
1. Overall wardrobe assessment
2. Strengths and versatile pieces
3. Gaps and missing essentials
4. Recommendations for optimization
5. Style profile analysis
6. Sustainability insights

Format as JSON:
{
  "overview": {
    "totalItems": number,
    "diversityScore": 0.8,
    "versatilityScore": 0.7,
    "utilizationScore": 0.6,
    "sustainabilityScore": 0.8
  },
  "strengths": ["strength1", "strength2"],
  "gaps": ["gap1", "gap2"],
  "recommendations": [
    {
      "type": "add",
      "item": "item name",
      "reason": "why needed",
      "priority": "high/medium/low",
      "estimatedCost": "$XX"
    }
  ],
  "styleProfile": {
    "primaryStyle": "style name",
    "secondaryStyles": ["style1", "style2"],
    "colorPalette": ["color1", "color2"],
    "preferredBrands": ["brand1", "brand2"]
  },
  "sustainability": {
    "costPerWear": "$X.XX",
    "underutilizedItems": ["item1", "item2"],
    "recommendations": ["sustainability tip1", "tip2"]
  }
}`,

  // Shopping recommendation prompt
  shoppingRecommendation: (context) => `
Please provide shopping recommendations based on:

**User Preferences**: ${JSON.stringify(context.preferences)}
**Budget**: $${context.budget}

**Current Wardrobe Analysis**:
${JSON.stringify(context.currentWardrobe, null, 2)}

**Identified Gaps**: ${context.gaps.join(', ')}

**Shopping Priorities**:
- Urgent needs: ${context.priorities.urgent.join(', ')}
- Seasonal needs: ${context.priorities.seasonal.join(', ')}
- Replacement needs: ${context.priorities.replacement.map(item => item.name).join(', ')}

Please recommend:
1. Priority items to purchase within budget
2. Budget allocation strategy
3. Alternative options at different price points
4. Best timing for purchases (sales, seasons)
5. Recommended stores/brands for students

Format as JSON:
{
  "priorityItems": [
    {
      "item": "item name",
      "category": "category",
      "priority": "high/medium/low",
      "estimatedPrice": "$XX",
      "reason": "why needed",
      "alternatives": ["cheaper option", "premium option"],
      "stores": ["store1", "store2"]
    }
  ],
  "budgetBreakdown": {
    "essentials": "$XX",
    "trendy": "$XX",
    "accessories": "$XX",
    "shoes": "$XX"
  },
  "alternatives": [
    {
      "scenario": "tight budget",
      "recommendations": ["item1", "item2"]
    }
  ],
  "timing": {
    "immediate": ["item1"],
    "nextMonth": ["item2"],
    "seasonal": ["item3"]
  },
  "stores": [
    {
      "name": "store name",
      "type": "budget/mid-range/premium",
      "bestFor": ["category1", "category2"],
      "studentDiscount": true/false
    }
  ]
}`,

  // Item style analysis prompt
  itemStyleAnalysis: (item) => `
Please analyze this wardrobe item:

**Item**: ${item.name}
**Category**: ${item.category}
**Color**: ${item.color}
**Brand**: ${item.brand}
**Condition**: ${item.condition}
**Wear Count**: ${item.wearCount}
**Price**: ${item.price ? `$${item.price}` : 'Unknown'}

Provide analysis including:
1. Style category and aesthetic
2. Versatility rating
3. Seasonal appropriateness
4. Styling suggestions
5. Care recommendations

Format as JSON:
{
  "styleCategory": "category name",
  "aesthetic": ["aesthetic1", "aesthetic2"],
  "versatility": "high/medium/low",
  "versatilityScore": 0.8,
  "seasonality": ["spring", "summer", "fall", "winter"],
  "occasions": ["casual", "formal", "work"],
  "colorProfile": {
    "primary": "color",
    "undertones": "warm/cool/neutral",
    "complementaryColors": ["color1", "color2"]
  },
  "stylingTips": [
    {
      "occasion": "casual",
      "suggestion": "styling tip",
      "pairWith": ["item1", "item2"]
    }
  ],
  "careInstructions": ["care tip1", "care tip2"],
  "costPerWear": "$X.XX",
  "recommendations": ["general recommendation1", "recommendation2"]
}`,

  // Lookbook generation prompt
  lookbookGeneration: (theme, items) => `
Create a lookbook for the theme: "${theme}"

Available items:
${items.map(item => `- ${item.name} (${item.category}, ${item.color})`).join('\n')}

Create 5-7 complete looks that:
1. Follow the theme
2. Use the available items creatively
3. Include styling variations
4. Provide mix-and-match options

Format as JSON:
{
  "theme": "${theme}",
  "looks": [
    {
      "id": "look_1",
      "title": "Look Name",
      "description": "Look description",
      "items": ["item1", "item2", "item3"],
      "occasion": "when to wear",
      "styleNotes": "styling tips",
      "variations": ["variation1", "variation2"]
    }
  ],
  "mixAndMatch": {
    "keyPieces": ["versatile item1", "versatile item2"],
    "combinations": ["combo1", "combo2"]
  }
}`,

  // Color analysis prompt
  colorAnalysis: (userInfo) => `
Analyze the best colors for this user:

**Skin Tone**: ${userInfo.skinTone || 'Not specified'}
**Hair Color**: ${userInfo.hairColor || 'Not specified'}
**Eye Color**: ${userInfo.eyeColor || 'Not specified'}
**Style Preferences**: ${userInfo.stylePreferences?.join(', ') || 'Not specified'}

Provide color recommendations including:
1. Best colors for their coloring
2. Colors to avoid
3. Neutral palette suggestions
4. Accent color recommendations

Format as JSON:
{
  "colorSeason": "spring/summer/autumn/winter",
  "bestColors": ["color1", "color2", "color3"],
  "avoidColors": ["color1", "color2"],
  "neutralPalette": ["neutral1", "neutral2", "neutral3"],
  "accentColors": ["accent1", "accent2"],
  "recommendations": [
    {
      "category": "tops",
      "colors": ["color1", "color2"],
      "reason": "why these colors work"
    }
  ]
}`
};

export default fashionPrompts;
