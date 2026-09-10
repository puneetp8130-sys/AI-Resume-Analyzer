import React from 'react';
import Card from '../common/Card.jsx';
import Badge from '../common/Badge.jsx';

export default function MissingSkillsList({ missingSkills = [] }) {
  return (
    <Card>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">Missing / Recommended Skills</h2>
      {missingSkills.length === 0 ? (
        <p className="text-sm text-gray-400">No skill gaps were identified.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {missingSkills.map((skill) => (
            <Badge key={skill} color="yellow">
              {skill}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
}
