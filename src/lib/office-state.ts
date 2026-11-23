import { initialOfficeState } from './mock-data';
import { OfficeStateResponse } from './types';

// In-memory runtime state for fast updates in testing
let dynamicState: OfficeStateResponse = { ...initialOfficeState };

export function getDynamicState(): OfficeStateResponse {
  return dynamicState;
}

export function updateAgentState(
  agentId: string,
  status: 'IDLE' | 'THINKING' | 'WORKING' | 'WAITING_APPROVAL',
  action: string,
  targetFile?: string
) {
  dynamicState = {
    ...dynamicState,
    agents: dynamicState.agents.map((ag) =>
      ag.id === agentId
        ? { ...ag, status, currentAction: action, targetFile: targetFile || ag.targetFile }
        : ag
    ),
  };
}
