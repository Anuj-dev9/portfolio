export async function fetchGithubProjects(username = 'Anuj-dev9') {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);
    if (!res.ok) {
      console.warn('GitHub API failed:', res.statusText);
      return [];
    }
    const data = await res.json();
    
    return data.map(repo => {
      // Create tags from language and topics
      const tags = [];
      if (repo.language) tags.push(repo.language);
      if (repo.topics && repo.topics.length > 0) {
        tags.push(...repo.topics.slice(0, 3));
      }
      
      // User explicitly requested React tag across all repos
      if (!tags.map(t => t.toLowerCase()).includes('react')) {
        tags.unshift('React');
      }
      
      if (tags.length === 0) tags.push('Open Source');
      
      // Attempt to intelligently categorize based on name or topics
      let cat = 'Full Stack';
      let icon = '⚡';
      let accent = '#3b82f6';
      
      const lowerName = repo.name.toLowerCase();
      if (lowerName.includes('react') || lowerName.includes('front') || lowerName.includes('web')) {
        cat = 'Frontend';
        icon = '✨';
        accent = '#a855f7';
      } else if (lowerName.includes('api') || lowerName.includes('back') || lowerName.includes('node') || lowerName.includes('express')) {
        cat = 'Backend';
        icon = '⚙️';
        accent = '#10b981';
      } else if (lowerName.includes('task') || lowerName.includes('flow')) {
        cat = 'Productivity';
        icon = '📋';
        accent = '#ec4899';
      }
      
      return {
        id: `gh-${repo.id}`,
        title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: repo.description || 'A software engineering project developed and maintained on GitHub.',
        desc: repo.description || 'A software engineering project developed and maintained on GitHub.', // frontend mapping uses desc
        tags: tags,
        category: cat,
        accent: accent,
        color: accent,
        icon: icon,
        links: {
          code: repo.html_url,
          live: repo.homepage || repo.html_url,
          github: repo.html_url
        },
        stats: [
          [repo.stargazers_count.toString(), 'Stars'],
          [repo.forks_count.toString(), 'Forks'],
          [(repo.size / 1024).toFixed(1) + 'MB', 'Size']
        ],
        featured: false, // Don't override statically featured ones natively
        isGithub: true 
      }
    });

  } catch (error) {
    console.error('Failed to fetch from GitHub:', error);
    return [];
  }
}
