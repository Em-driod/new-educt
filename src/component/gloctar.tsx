import  { useEffect, useRef } from 'react';

// Extend the Window interface to include 'mermaid'
declare global {
  interface Window {
    mermaid?: any;
  }
}

const AIFlowchart = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Mermaid if not loaded
    if (!window.mermaid) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js';
      script.onload = initializeMermaid;
      document.body.appendChild(script);
    } else {
      initializeMermaid();
    }

    function initializeMermaid() {
      window.mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        flowchart: {
          useMaxWidth: false,
          htmlLabels: true,
        },
      });

      // Render the diagram
      if (chartRef.current) {
        chartRef.current.innerHTML = `<div class="mermaid">${graphDefinition}</div>`;
        window.mermaid.contentLoaded();
      }

      // Add interaction after rendering
      setTimeout(() => {
        document.querySelectorAll('.node').forEach((node) => {
          node.addEventListener('click', (e) => {
            if (e.target && (e.target as HTMLElement).textContent) {
              console.log('Clicked node:', (e.target as HTMLElement).textContent?.trim());
            }
            // Add your interaction logic here
          });
        });
      }, 1000);
    }

    const graphDefinition = `
      flowchart TD
          %% Main Flow
          A[User Interface] -->|Request| B[Controller]
          B -->|Raw Input| C[Core Logic]
          
          %% Approval Workflow
          C -->|Request Copy| H{Approval Required?}
          H -->|Yes| I[Notify Approver\\nvia Email/Teams]
          I -->|Approved| C
          I -->|Rejected| A
          H -->|No| C
          
          %% Subsystems
          C -->|Schedule| D1[Calendar]
          C -->|Email| D2[Mail]
          C -->|Message| D3[WhatsApp]
          
          %% Pre-Approval Actions
          D1 --> E1[Check Availability]
          D2 --> E2[Compose Email]
          D3 --> E3[Format Message]
          
          %% Approval Gate
          E1 & E2 & E3 --> J{Approved?}
          J -->|Yes| F1[Book Slot]
          J -->|Yes| F2[Send Email]
          J -->|Yes| F3[Send WhatsApp]
          J -->|No| Z[Abort Process]
          
          %% Post-Approval
          F1 & F2 & F3 -->|Results| C
          C -->|Data| K[Behavioral Engine]
          K -->|Polished Response| L[Response Builder]
          L --> A

          %% Styling Classes
          class A,B,C,D1,D2,D3,E1,E2,E3,F1,F2,F3,K,L default
          class H,J decision
          class I approval-node
          class K,L behavior-node
    `;

    // Cleanup on component unmount
    return () => {
      if (window.mermaid) {
        window.mermaid = undefined;
      }
    };
  }, []);

  return (
    <div>
      <h2>AI Assistant Flowchart</h2>
      <div ref={chartRef} id="flowchart" style={{ width: '100%', height: '800px', border: '1px solid #eee', fontFamily: 'Arial' }} />
    </div>
  );
};

export default AIFlowchart;