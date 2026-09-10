import React from 'react';
import Input from '../common/Input.jsx';

export default function TargetRoleInput({ value, onChange }) {
  return (
    <Input
      id="target-role"
      label="Target job role (optional)"
      placeholder="e.g. Frontend Engineer"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
