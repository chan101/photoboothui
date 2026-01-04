'use client';
import { Box, CircularProgress, Backdrop, Typography } from "@mui/material";

import { useEffect, useState } from 'react';

export default function RetryImage({
	  src,
	  alt,
	  width,
	  height,
	  retryDelayMs = 3000,
}) {
	  const [available, setAvailable] = useState(false);
	  const [attempt, setAttempt] = useState(0);

	  useEffect(() => {
		      let timeout;

		      const checkImage = () => {
			            const img = new window.Image();
			            img.src = src;

			            img.onload = () => setAvailable(true);

			            img.onerror = () => {
					            timeout = setTimeout(() => {
							              setAttempt((a) => a + 1);
							            }, retryDelayMs);
					          };
			          };

		      setAvailable(false);
		      checkImage();

		      return () => clearTimeout(timeout);
		    }, [src, attempt, retryDelayMs]);

	  if (!available) {
		      return (
			            <div
			              style={{
					                width,
						                height,
						                display: 'flex',
						                alignItems: 'center',
						                justifyContent: 'center',
						                background: '#000000ff',
						              }}
			            >
			              <CircularProgress thickness={5} size={50} />
			            </div>
			          );
		    }

	  return (
		      <img
                    src={src}
                    alt={alt}
                    sizes='(max-width: 10px) 100vw, 10px'
                    loading="lazy"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />
		    );
}
