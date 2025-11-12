# Using Your Browsing Data with AI

Own Browse exports your browsing history in CSV format, making it easy to analyze with AI tools. This guide shows you how to use your exported data for deeper insights.

## Exporting Your Data

1. Open the Own Browse extension
2. Select your desired time range
3. Click either:
   - **Export Domains Data (CSV)** - for top domains by visits
   - **Export Days Data (CSV)** - for activity by day of week

The CSV files will be downloaded to your default downloads folder with timestamps.

## CSV Format

### Domains Data

```csv
Domain,Visit Count,Time Spent (minutes)
"github.com",145,145
"stackoverflow.com",89,89
"google.com",67,67
```

### Days Data

```csv
Day of Week,Visit Count,Time Spent (minutes)
"Sunday",45,45
"Monday",98,98
"Tuesday",105,105
```

## Using with AI Tools

### ChatGPT

1. Export your data from Own Browse
2. Open ChatGPT (https://chat.openai.com)
3. Start a new conversation
4. Upload your CSV file using the attachment button
5. Ask questions like:

**Example prompts:**
- "Analyze my browsing patterns and identify productivity trends"
- "What days am I most active online?"
- "Compare my weekday vs weekend browsing habits"
- "Suggest ways to optimize my browsing time based on this data"
- "What categories of websites do I visit most?"

### Claude

1. Export your data
2. Open Claude (https://claude.ai)
3. Attach your CSV file
4. Ask for analysis:

**Example prompts:**
- "Help me understand my browsing patterns from this data"
- "Create a summary of my top browsing categories"
- "What insights can you derive about my work-life balance?"
- "Compare my browsing across different days of the week"

### Google Gemini

1. Export your CSV data
2. Open Google Gemini
3. Upload your file
4. Request analysis:

**Example prompts:**
- "Analyze this browsing history data and provide insights"
- "Create a report on my internet usage patterns"
- "What recommendations do you have for better time management?"

### Microsoft Copilot

1. Export the CSV
2. Open Microsoft Copilot
3. Upload your data
4. Ask for analysis similar to above

## Advanced Analysis Ideas

### Time Management

Ask AI to:
- Identify time-wasting websites
- Suggest optimal browsing schedules
- Compare productive vs non-productive time
- Track changes over different time periods

### Personal Insights

Request AI to:
- Identify learning patterns (technical sites, documentation)
- Analyze news consumption habits
- Track hobby and interest evolution
- Compare weekday vs weekend interests

### Productivity Optimization

Have AI help you:
- Set browsing goals based on current patterns
- Identify distraction sources
- Suggest website blocking schedules
- Create a personalized productivity plan

### Trend Analysis

Use AI to:
- Compare data from different months
- Identify seasonal browsing patterns
- Track how habits change over time
- Predict future browsing trends

## Sample AI Conversation

**You:** "I've attached my browsing history CSV. Can you analyze my productivity patterns and suggest improvements?"

**AI:** Based on your browsing data, I can see:
- You visit developer sites (GitHub, Stack Overflow) most on Tuesday-Thursday
- Weekend browsing is primarily entertainment-focused
- You have high activity on social media during work hours
- Your most productive browsing appears to be Tuesday afternoons

Suggestions:
1. Block social media during peak work hours (9am-5pm)
2. Schedule focused coding time on Tuesday-Thursday
3. Use weekend time for learning new technologies
4. Set up website time limits for non-work sites

## Combining Multiple Exports

For deeper analysis, export data from different time periods:

1. Export last 7 days → `browsing-2025-11-12.csv`
2. Export last 30 days → `browsing-30days-2025-11-12.csv`
3. Export last 90 days → `browsing-90days-2025-11-12.csv`

Upload multiple files to AI and ask for comparative analysis:
- "Compare my browsing patterns across these three time periods"
- "How have my habits changed in the last 90 days?"
- "What trends are emerging in my internet usage?"

## Privacy Considerations

When sharing data with AI tools:

✅ **Good practices:**
- Review the CSV before uploading
- Remove sensitive domains if needed (edit CSV in spreadsheet app)
- Use AI tools with privacy features
- Don't share exported data publicly
- Delete conversations after analysis

❌ **Avoid:**
- Uploading data with private/work-related domains
- Sharing analysis results publicly
- Using untrusted AI platforms
- Storing sensitive data in cloud AI tools

## Spreadsheet Analysis

You can also analyze your data in spreadsheet applications:

### Excel / Google Sheets

1. Open the CSV file
2. Create pivot tables
3. Generate charts and graphs
4. Calculate statistics
5. Then ask AI to help interpret your spreadsheet analysis

### Python / Jupyter Notebooks

For technical users, analyze data programmatically:

```python
import pandas as pd
import matplotlib.pyplot as plt

# Load data
df = pd.read_csv('browsing-history-domains.csv')

# Analyze top domains
top_10 = df.nlargest(10, 'Visit Count')

# Create visualizations
plt.bar(top_10['Domain'], top_10['Visit Count'])
plt.xticks(rotation=45)
plt.show()
```

Then use AI to help with:
- Code suggestions
- Statistical analysis
- Visualization improvements
- Predictive modeling

## Regular Monitoring

Set up a routine:

1. **Weekly:** Export and review your data
2. **Monthly:** Compare with previous weeks
3. **Quarterly:** Look for long-term trends
4. **Yearly:** Conduct comprehensive analysis

Use AI to:
- Track progress on goals
- Identify habit changes
- Celebrate improvements
- Adjust strategies

## Example Analysis Questions

**General:**
- "What story does my browsing data tell about me?"
- "Am I spending my online time well?"
- "What would surprise me about my browsing habits?"

**Specific:**
- "How much time do I spend on developer documentation?"
- "When am I most likely to browse social media?"
- "What's the correlation between my browsing and productivity?"

**Actionable:**
- "Create a 30-day plan to improve my browsing habits"
- "What three changes would have the biggest impact?"
- "How can I align my browsing with my goals?"

## Getting Started

1. Export your first CSV from Own Browse
2. Choose an AI tool (ChatGPT, Claude, etc.)
3. Upload your data
4. Start with a simple question
5. Follow up based on the insights
6. Take action on recommendations
7. Track changes over time

Remember: Your data is yours. Use it to gain insights, make improvements, and better understand your digital life.
