import React from 'react';
import Card from '../common/Card.jsx';
import Badge from '../common/Badge.jsx';

export default function SkillsList({ skills = [] }) {
  return (
    <Card>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">Detected Skills</h2>
      {skills.length === 0 ? (
        <p className="text-sm text-gray-400">No skills were detected.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill} color="brand">
              {skill}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
}
