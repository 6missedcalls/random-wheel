import type { Segment } from '@/types';

/**
 * Parse DEFAULT_SEGMENTS array from defaults.ts file content
 */
export function parseDefaultSegments(fileContent: string): Segment[] {
  try {
    // Find the DEFAULT_SEGMENTS array
    const segmentsMatch = fileContent.match(
      /export\s+const\s+DEFAULT_SEGMENTS:\s*Segment\[\]\s*=\s*\[([\s\S]*?)\];/
    );

    if (!segmentsMatch) {
      throw new Error('Could not find DEFAULT_SEGMENTS array in file');
    }

    const arrayContent = segmentsMatch[1];

    // Split by segment objects (looking for { ... } patterns)
    const segmentStrings: string[] = [];
    let braceCount = 0;
    let currentSegment = '';
    let inString = false;
    let stringChar = '';

    for (let i = 0; i < arrayContent.length; i++) {
      const char = arrayContent[i];
      const prevChar = i > 0 ? arrayContent[i - 1] : '';

      // Track string boundaries
      if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
          stringChar = '';
        }
      }

      if (!inString) {
        if (char === '{') {
          if (braceCount === 0) {
            currentSegment = '{';
          } else {
            currentSegment += char;
          }
          braceCount++;
        } else if (char === '}') {
          braceCount--;
          currentSegment += char;
          if (braceCount === 0 && currentSegment.trim()) {
            segmentStrings.push(currentSegment);
            currentSegment = '';
          }
        } else if (braceCount > 0) {
          currentSegment += char;
        }
      } else {
        currentSegment += char;
      }
    }

    // Parse each segment object
    const segments: Segment[] = [];

    for (const segmentStr of segmentStrings) {
      // Skip commented segments
      if (segmentStr.trim().startsWith('//')) continue;

      try {
        // Convert TypeScript object notation to JSON
        let jsonStr = segmentStr
          // Remove trailing commas
          .replace(/,(\s*[}\]])/g, '$1')
          // Add quotes to unquoted keys
          .replace(/(\w+):/g, '"$1":')
          // Handle DEFAULT_SEGMENT_IMAGES references
          .replace(/DEFAULT_SEGMENT_IMAGES\[(\d+)\]/g, 'null');

        const segmentObj = JSON.parse(jsonStr);

        // Only include segments with required fields
        if (segmentObj.id && segmentObj.label && segmentObj.color) {
          segments.push({
            id: segmentObj.id,
            label: segmentObj.label,
            description: segmentObj.description || '',
            color: segmentObj.color,
            weight: segmentObj.weight ?? 1,
            image: segmentObj.image,
          });
        }
      } catch (err) {
        console.warn('Failed to parse segment:', segmentStr, err);
      }
    }

    return segments;
  } catch (error) {
    console.error('Failed to parse DEFAULT_SEGMENTS:', error);
    throw new Error(`Failed to parse segments: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate defaults.ts file content with updated segments
 */
export function generateDefaultsFile(segments: Segment[], originalContent: string): string {
  // Format segments as TypeScript array
  const segmentsCode = segments
    .map((segment) => {
      const lines: string[] = ['  {'];
      lines.push(`    id: '${segment.id}',`);
      lines.push(`    label: '${segment.label.replace(/'/g, "\\'")}',`);
      lines.push(`    description: '${(segment.description || '').replace(/'/g, "\\'")}',`);
      lines.push(`    color: '${segment.color}',`);
      lines.push(`    weight: ${segment.weight},`);

      if (segment.image) {
        lines.push(`    image: '${segment.image}',`);
      }

      lines.push('  }');
      return lines.join('\n');
    })
    .join(',\n');

  // Replace the DEFAULT_SEGMENTS array in the original content
  const newContent = originalContent.replace(
    /export\s+const\s+DEFAULT_SEGMENTS:\s*Segment\[\]\s*=\s*\[[\s\S]*?\];/,
    `export const DEFAULT_SEGMENTS: Segment[] = [\n${segmentsCode},\n];`
  );

  return newContent;
}

/**
 * Validate that a segment has all required fields
 */
export function validateSegment(segment: Partial<Segment>): segment is Segment {
  return !!(
    segment.id &&
    segment.label &&
    segment.color &&
    typeof segment.weight === 'number' &&
    segment.weight > 0
  );
}

/**
 * Create a new empty segment with default values
 */
export function createEmptySegment(): Partial<Segment> {
  return {
    id: '',
    label: '',
    description: '',
    color: '#FF6B6B',
    weight: 1,
  };
}
