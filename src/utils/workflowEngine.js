// ── Workflow Execution Engine ─────────────────────────────────────────────────

export function runWorkflows(eventType, eventData) {
  try {
    const workflows = JSON.parse(localStorage.getItem('crm_workflows') || '[]');
    const logs      = JSON.parse(localStorage.getItem('crm_workflow_logs') || '[]');
    const newLogs   = [];

    const active = workflows.filter(w => w.isActive && w.trigger === eventType);

    active.forEach(wf => {
      const conditionsPassed = checkConditions(wf.conditions || [], eventData);
      if (!conditionsPassed) return;

      const results = executeActions(wf.actions || [], eventData);

      newLogs.push({
        id:         `log-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
        workflowId: wf.id,
        workflowName: wf.name,
        trigger:    eventType,
        time:       new Date().toISOString(),
        actions:    results.map(r => r.label),
        status:     results.every(r => r.ok) ? 'Success' : 'Failed',
      });

      // Update lastRun
      const updated = workflows.map(w2 =>
        w2.id === wf.id ? { ...w2, lastRun: new Date().toISOString() } : w2
      );
      localStorage.setItem('crm_workflows', JSON.stringify(updated));
    });

    if (newLogs.length) {
      localStorage.setItem('crm_workflow_logs', JSON.stringify([...newLogs, ...logs].slice(0, 200)));
    }
    return newLogs;
  } catch (e) {
    console.error('Workflow engine error:', e);
    return [];
  }
}

function checkConditions(conditions, data) {
  if (!conditions.length) return true;
  return conditions.every(c => {
    const val  = data?.[c.field];
    const cval = isNaN(c.value) ? c.value : Number(c.value);
    const dval = isNaN(val)     ? val      : Number(val);
    switch (c.operator) {
      case '>':  return dval >  cval;
      case '<':  return dval <  cval;
      case '=':  return String(dval).toLowerCase() === String(cval).toLowerCase();
      case '!=': return String(dval).toLowerCase() !== String(cval).toLowerCase();
      case '>=': return dval >= cval;
      case '<=': return dval <= cval;
      default:   return true;
    }
  });
}

function executeActions(actions, eventData) {
  return actions.map(action => {
    try {
      switch (action.type) {
        case 'ASSIGN_USER': {
          return { label: `Assign to ${action.payload?.user || 'user'}`, ok: true };
        }
        case 'SEND_NOTIFICATION': {
          const notifs = JSON.parse(localStorage.getItem('crm_notifications') || '[]');
          notifs.unshift({ id: `n-${Date.now()}`, message: action.payload?.message || 'Workflow notification', time: new Date().toISOString(), read: false });
          localStorage.setItem('crm_notifications', JSON.stringify(notifs.slice(0, 50)));
          return { label: 'Send Notification', ok: true };
        }
        case 'CREATE_TASK': {
          const tasks = JSON.parse(localStorage.getItem('crm_tasks') || '[]');
          tasks.unshift({ id: `task-${Date.now()}`, title: action.payload?.title || 'Auto-created task', status: 'Open', priority: action.payload?.priority || 'Medium', dueDate: action.payload?.dueDate || new Date().toISOString().split('T')[0], owner: action.payload?.owner || 'John Sales', createdBy: 'Automation' });
          localStorage.setItem('crm_tasks', JSON.stringify(tasks));
          return { label: 'Create Task', ok: true };
        }
        case 'CREATE_INVOICE': {
          return { label: 'Create Invoice', ok: true };
        }
        case 'UPDATE_STATUS': {
          return { label: `Update Status → ${action.payload?.status || 'Active'}`, ok: true };
        }
        case 'SEND_EMAIL': {
          return { label: `Send Email to ${action.payload?.to || 'contact'}`, ok: true };
        }
        default:
          return { label: action.type, ok: true };
      }
    } catch {
      return { label: action.type, ok: false };
    }
  });
}
